import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleFormData = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (message) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  const handleAlertClose = () => {
    setShowAlert(false);
    navigate("/");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { token, user } = response.data;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      setMessage(`Welcome back, ${user.username}!`);
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
      setMessage("");
      setShowAlert(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-blue-700 mb-6">
          Log In
        </h2>

        {showAlert && message && (
          <div
            className="bg-blue-100 text-blue-800 px-6 py-3 rounded-lg font-semibold mb-5 flex justify-between items-center shadow-md border border-blue-300"
            role="alert"
          >
            <span>{message}</span>
            <button
              onClick={handleAlertClose}
              aria-label="Close alert"
              className="text-blue-800 font-bold hover:text-blue-900 transition text-2xl leading-none"
            >
              &times;
            </button>
          </div>
        )}

        {showAlert && error && !message && (
          <div
            className="bg-red-100 text-red-700 px-6 py-3 rounded-lg font-semibold mb-5 flex justify-between items-center shadow-md border border-red-300"
            role="alert"
          >
            <span>{error}</span>
            <button
              onClick={() => setShowAlert(false)}
              aria-label="Close alert"
              className="text-red-700 font-bold hover:text-red-900 transition text-2xl leading-none"
            >
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-gray-700 font-semibold text-sm"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              onChange={handleFormData}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-gray-700 font-semibold text-sm"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              onChange={handleFormData}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-lg font-semibold transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Don't have an account?{" "}
          <a
            href="/user-signup"
            className="text-blue-700 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
