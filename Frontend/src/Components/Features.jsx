import React from 'react'
import { FaBolt, FaSearch, FaMobileAlt, FaGlobe, FaShieldAlt, FaBullseye } from "react-icons/fa";


function Features() {

  const features = [
  {
    icon: <FaBullseye size={24} />,
    title: "Skill-Based Matching",
    desc: "Our algorithm matches you with people who have complementary skills to yours",
  },
  {
    icon: <FaBolt size={24} />,
    title: "Real-Time Connections",
    desc: "Instant messaging and notifications keep you connected with active collaborators",
  },
  {
    icon: <FaMobileAlt size={24} />,
    title: "Intuitive Swipe UI",
    desc: "Familiar swipe interface makes finding collaborators as easy as dating apps",
  },
  {
    icon: <FaSearch size={24} />,
    title: "Advanced Filters",
    desc: "Filter by location, skills, project type, and collaboration goals",
  },
  {
    icon: <FaShieldAlt size={24} />,
    title: "Verified Profiles",
    desc: "All profiles are verified to ensure authentic connections and collaborations",
  },
  {
    icon: <FaGlobe size={24} />,
    title: "Global Network",
    desc: "Connect with talented individuals from around the world or in your local area",
  },
];
  
    return (
    <section className="bg-black text-white py-20 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">Why Choose Connectly?</h2>
        <p className="text-gray-400 text-lg">
          Built for creators, developers, and entrepreneurs who want to collaborate effectively
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="bg-[#0e0e0e] rounded-xl p-6 shadow hover:shadow-lg transition">
            <div className="bg-white text-black w-10 h-10 flex items-center justify-center rounded-md mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
  
}

export default Features