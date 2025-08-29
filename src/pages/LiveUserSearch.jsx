import { useState, useEffect, useRef } from "react";

export default function LiveUserSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const [dropdownOpenUserId, setDropdownOpenUserId] = useState(null);
  const dropdownRef = useRef(null);

  const BACKEND_URL = "http://localhost:3000";

  // Fetch current user's followings on component mount
  useEffect(() => {
    async function fetchFollowings() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${BACKEND_URL}/api/users/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load followings");

        const data = await res.json();
        const followedIds = new Set(data.followings.map((user) => user._id));
        setFollowingUsers(followedIds);
      } catch (error) {
        console.error(error);
      }
    }
    fetchFollowings();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpenUserId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search users debounced
  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setLoading(false);
      setError(null);
      return;
    }

    const delayDebounce = setTimeout(() => {
      async function fetchUsers() {
        setLoading(true);
        setError(null);
        try {
          const token = sessionStorage.getItem("token");
          if (!token) throw new Error("Not authenticated");

          const response = await fetch(
            `${BACKEND_URL}/api/users/search?username=${encodeURIComponent(
              query
            )}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch");

          const data = await response.json();
          setUsers(data.users || []);
          // Do NOT reset followingUsers here; keep previously fetched followed users
        } catch (err) {
          setError(err.message);
          setUsers([]);
        } finally {
          setLoading(false);
        }
      }
      fetchUsers();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Follow user
  const handleFollow = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to follow users.");
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/users/follow/${userId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to follow");
      }

      setFollowingUsers((prev) => new Set(prev).add(userId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Unfollow user
  const handleUnfollow = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to unfollow users.");
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/api/users/unfollow/${userId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to unfollow");
      }

      setFollowingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      setDropdownOpenUserId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Search</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-lg px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        aria-label="Search users by username"
      />

      {loading && (
        <div className="mt-4">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx={12}
              cy={12}
              r={10}
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8"
            />
          </svg>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-4 text-center font-semibold max-w-lg w-full shadow">
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && query.trim() !== "" && (
        <p className="text-gray-500 text-center w-full max-w-lg">
          No users found.
        </p>
      )}

      <ul className="w-full max-w-lg bg-white rounded-lg shadow divide-y divide-gray-200 mt-6">
        {users.map((user) => {
          const isFollowing = followingUsers.has(user._id);

          return (
            <li
              key={user._id}
              className="px-6 py-4 cursor-pointer flex justify-between items-center relative"
            >
              <div>
                <span className="font-semibold text-lg text-gray-900">
                  {user.username}
                </span>
                <div className="text-gray-600 text-sm">
                  {user.bio || user.email}
                </div>
              </div>

              {!isFollowing ? (
                <button
                  onClick={() => handleFollow(user._id)}
                  className="ml-4 px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
                  aria-label={`Follow ${user.username}`}
                >
                  Follow
                </button>
              ) : (
                <div className="ml-4 relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setDropdownOpenUserId(
                        dropdownOpenUserId === user._id ? null : user._id
                      )
                    }
                    className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpenUserId === user._id}
                    aria-label={`${user.username} is following - options`}
                  >
                    Following ▼
                  </button>

                  {dropdownOpenUserId === user._id && (
                    <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-lg z-10">
                      <button
                        onClick={() => handleUnfollow(user._id)}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                      >
                        Unfollow
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
