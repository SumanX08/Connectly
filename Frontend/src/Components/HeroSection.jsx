import { Link } from "react-router-dom";
import { SwipeInterface } from "../Components/SwipeInterface";
import { motion } from "framer-motion"

const HeroSection = () => {


  return (
 <section className="min-h-screen pt-20 lg:pt-10 pb-14 bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center min-h-screen w-full max-w-7xl">
<div>
    <div className="space-y-6 text-left ">
     <motion.h1
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-left"
      >
        <span className="block">Swipe.</span>
        <span className="block bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Connect.
        </span>
        <span className="block">Grow.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl mb-6 sm:mb-8"
      >
        Connect with the right people to build, grow, and create together.{" "}
        Swipe profiles, Connect with collaborators, and turn ideas into reality.
      </motion.p>

     
    </div>
    <div className="flex flex-col items-center">
       <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"
      >
        <Link to="/signup" className="w-full sm:w-64">
          <button className="w-full cursor-pointer bg-white text-black px-1 py-3 rounded-md font-medium hover:bg-gray-200 transition">
            Make your first conenction →
          </button>
        </Link>
        <Link to="/login" className="w-full sm:w-40">
          <button className="w-full cursor-pointer bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
            Login
          </button>
        </Link>
      </motion.div>
    </div>

    </div>

    {/* Right Side - Swipe Interface */}
    <div className="flex justify-center lg:justify-end w-full">
        <SwipeInterface />
    
    </div>
  </div>
</section>

  );
};

export default HeroSection;
