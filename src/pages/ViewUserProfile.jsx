import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultProfilePicture from "../assets/default-pfp.png";

export default function ViewUserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const BACKEND_URL = "http://localhost:3000";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchUserAndFollowings() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${BACKEND_URL}/api/users/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch user profile");
        }
        const { user } = await res.json();
        setUser(user);

        const followingsRes = await fetch(
          `${BACKEND_URL}/api/users/following`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!followingsRes.ok) throw new Error("Failed to load followings");
        const followingsData = await followingsRes.json();
        const followedIds = new Set(
          followingsData.followings.map((u) => u._id)
        );
        setFollowingUsers(followedIds);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchUserAndFollowings();
  }, [id]);

  const handleFollow = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Login required");
        return;
      }
      const res = await fetch(`${BACKEND_URL}/api/users/follow/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to follow");
      }
      setFollowingUsers((prev) => new Set(prev).add(id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("Login required");
        return;
      }
      const res = await fetch(`${BACKEND_URL}/api/users/unfollow/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to unfollow");
      }
      setFollowingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setDropdownOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Pass the user object via router state to the chat component
  const handleMessage = () => {
    navigate("/private-chatwindow", { state: { user } });
  };

  const isFollowing = followingUsers.has(id);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return <div>Loading profile...</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-16 px-6 md:px-12 lg:px-24">
      <img
        src={
          user.avatar ? `${BACKEND_URL}${user.avatar}` : DefaultProfilePicture
        }
        alt={`${user.username}'s avatar`}
        className="rounded-full w-44 h-44 object-cover border-4 border-pink-500 shadow-lg"
      />
      <h1 className="text-4xl font-semibold mt-4">{user.username}</h1>
      <p className="text-gray-700 max-w-3xl mt-4 text-lg">
        {user.bio || "No bio available."}
      </p>
      <div className="flex space-x-12 mt-6 text-center">
        <button className="font-bold text-xl">
          {user.followers.length}{" "}
          <span className="text-gray-600 font-normal ml-1">Followers</span>
        </button>
        <button className="font-bold text-xl">
          {user.followings.length}{" "}
          <span className="text-gray-600 font-normal ml-1">Following</span>
        </button>
      </div>

      <div className="flex space-x-4 mt-8">
        {!isFollowing ? (
          <button
            onClick={handleFollow}
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Follow
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition focus:outline-none"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              Following ▼
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-lg z-10">
                <button
                  onClick={handleUnfollow}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                >
                  Unfollow
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleMessage}
          className="px-6 py-3 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition"
        >
          Message
        </button>
      </div>
    </div>
  );
}
