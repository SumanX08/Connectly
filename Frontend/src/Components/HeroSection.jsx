import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 text-center">
      {/* Headline */}
      <h1
        className={`text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-4 transition-all duration-700 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        Where Skills Meet <br /> Collaboration
      </h1>

      {/* Subheadline */}
      <p
        className={`text-gray-300 text-base sm:text-lg max-w-2xl mb-8 transition-all duration-700 delay-200 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        Connect with the right people to build, grow, and create together. Swipe
        through profiles, match with collaborators, and turn ideas into reality.
      </p>

      {/* Buttons */}
      <div
        className={`flex gap-4 transition-all duration-700 delay-400 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        <Link to="/signup">
          <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
            Join Now →
          </button>
        </Link>
        <Link to="/login">
          <button className="bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition">
            Login
          </button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
