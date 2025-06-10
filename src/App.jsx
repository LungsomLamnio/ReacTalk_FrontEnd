import { Routes, Route } from "react-router-dom";
import Registration from "./auth/Registration";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="user-register" element={<Registration />} />
      </Routes>
    </>
  );
}

export default App;
