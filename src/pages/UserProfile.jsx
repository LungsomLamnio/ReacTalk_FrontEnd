import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfilePicture from "../assets/default-pfp.png";

export default function UserProfile() {
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  // Example click handlers to navigate or open modals for followers/followings
  const handleViewFollowers = () => {
    navigate("/followers");
  };

  const handleViewFollowings = () => {
    navigate("/following");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("You must be logged in");
        setTimeout(() => {
          navigate("/user-login");
        }, 3000);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfileData(response.data.user);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch profile.");

        if (err.response?.status === 401) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          navigate("/user-login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-16 px-6 md:px-12 lg:px-24">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6 text-center font-semibold w-full max-w-3xl">
          {error}
        </div>
      )}

      {!profileData && !error && (
        <div className="flex justify-center items-center h-48 w-full max-w-3xl">
          <svg
            className="animate-spin h-12 w-12 text-blue-600"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
        </div>
      )}

      {profileData && (
        <div className="flex flex-col md:flex-row md:items-center md:space-x-16 w-full max-w-5xl">
          {/* Profile Picture */}
          <div className="flex justify-center md:block mb-10 md:mb-0 flex-shrink-0">
            <img
              src={ProfilePicture}
              alt="Profile"
              className="rounded-full w-44 h-44 object-cover border-4 border-pink-500 shadow-lg"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-4xl font-semibold mb-4 md:mb-0">
                {profileData.username}
              </h1>
              <button className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-100 transition">
                Edit Profile
              </button>
            </div>

            <div className="flex justify-around md:justify-start md:space-x-12 text-center md:text-left mb-6 space-x-6">
              <button
                onClick={handleViewFollowers}
                className="cursor-pointer font-bold text-xl hover:text-blue-600 transition"
                type="button"
                aria-label="View Followers"
              >
                {profileData.followers?.length || 0}{" "}
                <span className="text-gray-600 font-normal ml-1">
                  Followers
                </span>
              </button>
              <button
                onClick={handleViewFollowings}
                className="cursor-pointer font-bold text-xl hover:text-blue-600 transition"
                type="button"
                aria-label="View Following"
              >
                {profileData.followings?.length || 0}{" "}
                <span className="text-gray-600 font-normal ml-1">
                  Following
                </span>
              </button>
              <div className="font-bold text-xl">
                0 <span className="text-gray-600 font-normal ml-1">Posts</span>
              </div>
            </div>

            <p className="text-gray-700 max-w-3xl mb-4 text-lg">
              {profileData.bio || "No bio available."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
