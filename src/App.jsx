import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignUp";
import ChatPage from "./pages/ChatPage";
import UserProfile from "./pages/UserProfile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-signup" element={<UserSignup />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
