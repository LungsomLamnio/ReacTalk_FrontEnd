import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    name: "Home",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10l9-7 9 7v11a2 2 0 01-2 2h-4a2 2 0 01-2-2V14a2 2 0 00-4 0v5a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"
        />
      </svg>
    ),
    link: "/",
  },
  {
    name: "Search",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0A7 7 0 104.5 4.5a7 7 0 0012.15 12.15z"
        />
      </svg>
    ),
    link: "/search-users",
  },
  {
    name: "Messages",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 15V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14l4 4V7a2 2 0 00-2-2z"
        />
      </svg>
    ),
    link: "/messages",
  },
  {
    name: "Notifications",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 17h5l-1.405-1.404A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .537-.214 1.054-.595 1.437L4 17h5m6 0v1a3 3 0 01-6 0v-1"
        />
      </svg>
    ),
    link: "/notifications",
  },
  {
    name: "Profile",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.121 17.804A8.001 8.001 0 0112 16c1.736 0 3.338.567 4.64 1.528m1.98-2.13A9 9 0 103 12.002c0 1.855.567 3.577 1.542 4.997M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    link: "/user-profile",
  },
  {
    name: "Settings",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7v6m6-3a6 6 0 01-12 0m6 9v2m-2-2h4"
        />
      </svg>
    ),
    link: "/settings",
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen w-20 md:w-64 bg-gray-50 flex flex-col pt-10 border-r border-gray-200 text-gray-900 fixed left-0 top-0">
      <div className="flex items-center justify-center mb-8 px-4">
        <span className="text-3xl font-semibold tracking-widest">ReacTalk</span>
      </div>
      <nav className="flex flex-col gap-2 px-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.link}
            className={`flex items-center gap-5 px-4 py-3 rounded-lg transition duration-200 ease-in-out
              ${
                location.pathname === item.link
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-blue-50 hover:text-blue-600"
              }`}
            style={{ textDecoration: "none" }}
          >
            {item.icon}
            <span className="hidden md:inline-block text-base select-none">
              {item.name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
