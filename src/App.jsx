import { Routes, Route } from "react-router-dom";
import Registration from "./auth/Registration";
import Home from "./pages/Home";
import Login from "./auth/Login";
import ChatBox from "./pages/ChatBox";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="user-register" element={<Registration />} />
        <Route path="user-login" element={<Login />} />
        <Route path="user-chats" element={<ChatBox />} />
      </Routes>
    </>
  );
}

export default App;
