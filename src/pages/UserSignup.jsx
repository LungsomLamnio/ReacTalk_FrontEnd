import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserSignup() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
        navigate("/user-login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  const handleAlertClose = () => {
    setShowAlert(false);
    navigate("/user-login");
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/users/signup", formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setError("");
      setMessage("Signup successful! Please login.");
    } catch (err) {
      setError(err.response?.data?.message || "Signup Failed");
      setMessage("");
      setShowAlert(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-blue-700 mb-6">
          Create Account
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
          {["username", "email", "password", "confirmPassword"].map(
            (field, idx) => {
              const labels = {
                username: "Username",
                email: "Email Address",
                password: "Password",
                confirmPassword: "Confirm Password",
              };
              const placeholders = {
                username: "Enter username",
                email: "Enter email",
                password: "Enter password",
                confirmPassword: "Confirm password",
              };
              return (
                <div key={idx}>
                  <label
                    htmlFor={field}
                    className="block mb-1 text-gray-700 font-semibold text-sm"
                  >
                    {labels[field]}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type={
                      field === "password" || field === "confirmPassword"
                        ? "password"
                        : field === "email"
                        ? "email"
                        : "text"
                    }
                    placeholder={placeholders[field]}
                    value={formData[field]}
                    onChange={handleFormData}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              );
            }
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-lg font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Already have an account?{" "}
          <a
            href="/user-login"
            className="text-blue-700 font-semibold hover:underline"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
