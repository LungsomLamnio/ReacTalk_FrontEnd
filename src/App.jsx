import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import ChatPage from "./pages/ChatPage";
import UserProfile from "./pages/UserProfile";
import SearchUsers from "./pages/SearchUsers";
import UniversalChat from "./pages/UniversalChat";
import ChatList from "./pages/ChatList";
import ChatWindow from "./pages/PrivateChatWindow";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-signup" element={<UserSignup />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/search-users" element={<SearchUsers />} />
      <Route path="/universal-chat" element={<UniversalChat />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat-list" element={<ChatList />} />
      <Route path="/private-chatwindow" element={<ChatWindow />} />
    </Routes>
  );
}
