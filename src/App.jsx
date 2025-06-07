import { Routes, Route } from "react-router-dom";
import Registeration from "./auth/Registeration";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="user-register" element={<Registeration />} />
      </Routes>
    </>
  );
}

export default App;
