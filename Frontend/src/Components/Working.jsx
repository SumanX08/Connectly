import { FaUserPlus, FaHeart, FaComments } from "react-icons/fa";
import { motion } from "framer-motion";

const steps = [
  {
    icon: <FaUserPlus size={28} />,
    title: "1. Create Profile",
    desc: "Set up your profile with your skills, experience, and what you're looking to build",
  },
  {
    icon: <FaHeart size={28} />,
    title: "2. Swipe to Match",
    desc: "Browse through profiles and swipe right on people you'd like to collaborate with",
  },
  {
    icon: <FaComments size={28} />,
    title: "3. Start Collaborating",
    desc: "Connect with your matches and start building amazing projects together",
  },
];

// Animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Working = () => {
  return (
    <section className="bg-gray-900/50 text-white py-20 px-6 text-center">
      <h2 className="text-4xl font-bold mb-2">How It Works</h2>
      <p className="text-gray-400 mb-12">
        Three simple steps to find your perfect collaboration partner
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col md:flex-row justify-center items-center gap-12 max-w-6xl mx-auto"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="max-w-xs flex flex-col items-center"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="bg-white text-black rounded-xl p-4 mb-4 shadow-md"
            >
              {step.icon}
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
            <p className="text-gray-400">{step.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Working;
