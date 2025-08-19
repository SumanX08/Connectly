import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SwipeInterface } from "../Components/SwipeInterface";
import {motion} from "framer-motion"

const HeroSection = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <section className="min-h-screen pt-20 lg:pt-10 pb-14 bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center min-h-screen w-full max-w-7xl">
        
        {/* Left side - Headline & Text */}
        <div className="space-y-6 text-center lg:text-left">
          <motion.h1
          initial={{opacity:0,x:-50}}
          animate={{opacity:1,x:0}}
          transition={{ duration: 0.8, delay: 0.2 }}
           className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
            <span className="block">Swipe.</span>
            <span className="block bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Connect.
            </span>
            <span className="block">Grow.</span>
          </motion.h1>

          <motion.p
           initial={{opacity:0,x:-50}}
          animate={{opacity:1,x:0}}
          transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-gray-300 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 
            }`}
            
          >
            Connect with the right people to build, grow, and create together.
            <br className="hidden sm:block" />
            Swipe through profiles, match with collaborators, and turn ideas into reality.
          </motion.p>

          <div
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start transition-all duration-700 delay-400 ${
              show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionProperty: "opacity, transform" }}
          >
            <Link to="/signup">
              <button className="md:w-full sm:w-auto bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
                Join Now →
              </button>
            </Link>
            <Link to="/login">
              <button className="md:w-full sm:w-auto bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
                Login
              </button>
            </Link>
          </div>
        </div>

        {/* Right side - Swipe Interface */}
        <div className="flex justify-center lg:justify-end w-full">
          <div className="">
            <SwipeInterface />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
