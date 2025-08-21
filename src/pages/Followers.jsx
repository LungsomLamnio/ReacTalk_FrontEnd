import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChatList() {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFollowers() {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          setError("Please log in to see your followings");
          setLoading(false);
          setTimeout(() => {
            navigate("/user-login");
          }, 3000);
          return;
        }

        const response = await fetch(
          "http://localhost:3000/api/users/followers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setFollowers(data.followers || []);
      } catch (err) {
        setError("Failed to load followings");
      } finally {
        setLoading(false);
      }
    }

    fetchFollowers();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
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
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-16">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center tracking-wide">
          Users Followed You
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center font-semibold shadow">
            {error}
          </div>
        )}

        {!error && followers.length === 0 && (
          <p className="text-gray-500 text-center">
            No one is following you yet
          </p>
        )}

        <ul className="divide-y divide-gray-200">
          {followers.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between py-4 hover:bg-blue-50 transition cursor-pointer px-2 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-pink-400"
                />
                <div>
                  <div className="font-semibold text-lg text-gray-800">
                    {user.username}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {user.bio || user.email}
                  </div>
                </div>
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-medium text-sm hover:bg-blue-700 shadow transition"
                onClick={() =>
                  navigate("/private-chatwindow", { state: { user } })
                }
              >
                Message
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
