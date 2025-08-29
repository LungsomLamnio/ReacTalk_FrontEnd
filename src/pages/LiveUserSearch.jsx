import { useState, useEffect } from "react";

export default function LiveUserSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [followingUsers, setFollowingUsers] = useState(new Set());

  // Fetch users when query changes
  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setLoading(false);
      setError(null);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
          const token = sessionStorage.getItem("token");
          const response = await fetch(
            `http://localhost:3000/api/users/search?username=${encodeURIComponent(
              query
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch users");
          }

          const data = await response.json();
          setUsers(data.users || []);
        } catch (err) {
          setError(err.message);
          setUsers([]);
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Handler to follow a user
  const handleFollow = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to follow users.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/users/follow/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to follow user");
      }

      // Update local following state for immediate UI feedback
      setFollowingUsers((prev) => new Set(prev).add(userId));
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
              cx="12"
              cy="12"
              r="10"
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
        {users.map((user) => (
          <li
            key={user._id}
            className="px-6 py-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
          >
            <div>
              <span className="font-semibold text-gray-900 text-lg">
                {user.username}
              </span>
              <div className="text-gray-600 text-sm">
                {user.bio || user.email}
              </div>
            </div>
            <button
              onClick={() => handleFollow(user._id)}
              disabled={followingUsers.has(user._id)}
              className={`ml-4 px-4 py-2 rounded text-white ${
                followingUsers.has(user._id)
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              aria-label={`Follow ${user.username}`}
            >
              {followingUsers.has(user._id) ? "Following" : "Follow"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
