import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserLogin from "./pages/UserLogin";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/user-login" element={<UserLogin />} />
    </Routes>
  );
}
