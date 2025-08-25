import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Heart,
  User,
  SlidersHorizontal,
  MessageCircle,
} from "lucide-react";
import React from "react";

const navItems = [
  { path: "/home", label: "Home", icon: <Home size={20} /> },
  { path: "/connections", label: "Connections", icon: <Heart size={20} /> },
  { path: "/message", label: "Message", icon: <MessageCircle size={20} /> },
  { path: "/profile", label: "Profile", icon: <User size={20} /> },
  { path: "/filters", label: "Filters", icon: <SlidersHorizontal size={20} /> },
];

const containerVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 12,
      staggerChildren: 0.1,
    },
  },
};

const MotionLink = motion(Link);

const Navbar = React.memo(() => {
  const { pathname } = useLocation();

  return (
    <motion.nav
      className="fixed bottom-1 left-0 right-0 border border-gray-50/20 bg-black rounded-lg flex justify-around items-center z-50 text-sm mx-2 sm:mx-10 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {navItems.map(({ path, label, icon }) => {
        const isActive = pathname === path;

        return (
          <div
            key={path}
            className="relative w-16 sm:w-24  h-14 flex justify-center items-center"
          >
            {isActive && (
              <motion.div
                layoutId="activeBg"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0 bg-zinc-800 rounded-xl  shadow-md"
              />
            )}

            {/* Nav Link */}
            <MotionLink
              to={path}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`relative flex flex-col items-center justify-center w-full h-full rounded-xl ${
                isActive
                  ? "text-gray-100"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <div className="text-lg mb-1">{icon}</div>
              <div className="text-xs sm:text-sm">{label}</div>
            </MotionLink>
          </div>
        );
      })}
    </motion.nav>
  );
});

export default Navbar;
