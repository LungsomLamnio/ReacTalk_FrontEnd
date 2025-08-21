import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen ml-20 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}
