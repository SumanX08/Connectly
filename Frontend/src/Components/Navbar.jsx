import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Heart,
  User,
  SlidersHorizontal,
  MessageCircle,
} from "lucide-react";

const navItems = [
  { path: "/home", label: "Home", icon: <Home size={20} /> },
  { path: "/matches", label: "Matches", icon: <Heart size={20} /> },
  { path: "/message", label: "Message", icon: <MessageCircle size={20} /> },
  { path: "/profile", label: "Profile", icon: <User size={20} /> },
  { path: "/filters", label: "Filters", icon: <SlidersHorizontal size={20} /> },
];

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-4 border-gray-50 border left-4 right-4 bg-black rounded-lg flex justify-around items-center z-50 text-sm">
      {navItems.map(({ path, label, icon }) => {
        const isActive = pathname === path;

        return (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center transition-all duration-300 transform px-4 py-1 rounded-xl w-full mx-1 ${
              isActive
                ? "bg-zinc-800 shadow-lg scale-90"
                : "text-neutral-400 hover:text-white hover:scale-105"
            }`}
          >
            <span
              className={`text-lg mb-1 ${
                isActive
                  ? "text-gray-100"
                  : ""
              }`}
            >
              {icon}
            </span>
            <span
              className={`text-md font-medium ${
                isActive
                  ? "text-gray-100"
                  : ""
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
