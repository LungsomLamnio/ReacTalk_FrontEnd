import { Routes, Route } from "react-router-dom";
import Registration from "./auth/Registration";
import Home from "./pages/Home";
import Login from "./auth/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="user-register" element={<Registration />} />
        <Route path="user-login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
