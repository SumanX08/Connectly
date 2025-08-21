import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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

const MotionLink = motion.create(Link);

const Navbar = () => {
  const { pathname } = useLocation();

  return (
    <motion.nav
      className="fixed bottom-1 left-4 right-4 border border-gray-50 bg-black rounded-lg flex justify-around items-center z-50 text-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {navItems.map(({ path, label, icon }) => {
        const isActive = pathname === path;

        return (
          <div
            key={path}
            className="relative flex justify-center items-center"
          >
            {/* Active background — responsive width */}
            {isActive && (
              <motion.div
                layoutId="activeBg"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute h-full bg-zinc-800 rounded-xl shadow-xl px-8 md:px-18 lg:px-24"
              />
            )}

            <div className="relative w-2 sm:w-24 h-14 flex justify-center items-center">
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center"
              >
                <MotionLink
                  to={path}
                  className={`flex flex-col items-center justify-center w-full h-full rounded-xl ${
                    isActive
                      ? "text-gray-100"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="text-md font-medium">{label}</div>
                </MotionLink>
              </motion.div>
            </div>
          </div>
        );
      })}
    </motion.nav>
  );
};

export default Navbar;
