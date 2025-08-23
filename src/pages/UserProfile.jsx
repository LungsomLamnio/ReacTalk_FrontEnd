import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserProfile() {
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profilePicture: null,
    profilePicturePreview: "",
  });
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const BACKEND_URL = "http://localhost:3000";

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
        const response = await axios.get(`${BACKEND_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfileData(response.data.user);
        setFormData({
          username: response.data.user.username || "",
          bio: response.data.user.bio || "",
          profilePicture: null,
          profilePicturePreview: response.data.user.avatar
            ? `${BACKEND_URL}${
                response.data.user.avatar
              }?t=${new Date().getTime()}`
            : "", // no default image
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile.");
        if (err.response?.status === 401) {
          sessionStorage.clear();
          navigate("/user-login");
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleEditToggle = () => {
    setEditing(!editing);
    if (editing && profileData) {
      setFormData({
        username: profileData.username || "",
        bio: profileData.bio || "",
        profilePicture: null,
        profilePicturePreview: profileData.avatar
          ? `${BACKEND_URL}${profileData.avatar}?t=${new Date().getTime()}`
          : "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
        profilePicturePreview: URL.createObjectURL(file), // local preview
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const updateData = new FormData();
      updateData.append("username", formData.username);
      updateData.append("bio", formData.bio);
      if (formData.profilePicture) {
        updateData.append("profilePicture", formData.profilePicture);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const res = await axios.post(
        `${BACKEND_URL}/api/users/update-profile`,
        updateData,
        config
      );

      setProfileData(res.data.user);
      setFormData((prev) => ({
        ...prev,
        profilePicturePreview: `${BACKEND_URL}${
          res.data.user.avatar
        }?t=${new Date().getTime()}`,
      }));
      setEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to update profile"
      );
    }
  };

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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
      )}

      {profileData && (
        <div className="flex flex-col md:flex-row md:items-center md:space-x-16 w-full max-w-5xl">
          <div className="flex flex-col items-center md:block mb-10 md:mb-0 flex-shrink-0">
            {formData.profilePicturePreview ? (
              <img
                src={formData.profilePicturePreview}
                alt="Profile"
                className="rounded-full w-44 h-44 object-cover border-4 border-pink-500 shadow-lg"
              />
            ) : (
              <div className="w-44 h-44 rounded-full border-4 border-pink-500 shadow-lg bg-gray-200" />
            )}
            {editing && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Change Picture
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex-1">
            {!editing ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h1 className="text-4xl font-semibold mb-4 md:mb-0">
                    {profileData.username}
                  </h1>
                  <button
                    onClick={handleEditToggle}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-100 transition"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="flex justify-around md:justify-start md:space-x-12 text-center md:text-left mb-6 space-x-6">
                  <button
                    onClick={() => navigate("/followers")}
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
                    onClick={() => navigate("/following")}
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
                    0{" "}
                    <span className="text-gray-600 font-normal ml-1">
                      Posts
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 max-w-3xl mb-4 text-lg">
                  {profileData.bio || "No bio available."}
                </p>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
                <div>
                  <label
                    className="block font-semibold mb-1"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1" htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="ml-4 px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
