import { useState } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import  ProfileCard  from './ProfileCard.jsx';
import ActionButtons from './ActionButtons.jsx';
import AlexThompson  from "../assets/Alex Thompson.png"
import SarahChen from "../assets/Sarah Chen.png"
import MarcusJohnson from "../assets/Marcus Johnson.png"

const profiles = [
  {
    _id: '1',
    age:25,
    username: 'Alex Thompson',
    location: 'Seattle, WA',
    avatar: AlexThompson,
    bio: 'Product manager with 7+ years of experience launching successful digital products...',
    skills: ['Product Management', 'Agile', 'Strategy'],
    lookingFor: ['Analytics', 'UX design', 'Cloud']
  },
  {
    _id: '2',
    username: 'Sarah Chen',
    location: 'San Francisco, CA',
    avatar: SarahChen,
    bio: 'Senior UX Designer passionate about creating intuitive digital experiences...',
    skills: ['UX Design', 'Figma', 'Research'],
    lookingFor: ['Frontend Dev', 'Product Management', 'Startup']
  },
  {
    _id: '3',
    username: 'Marcus Johnson',
    location: 'Austin, TX',
    avatar: MarcusJohnson,
    bio: 'Full-stack developer with expertise in React and Node.js...',
    skills: ['React', 'Node.js', 'TypeScript'],
    lookingFor: ['Product Manager', 'Designer', 'DevOps']
  }
];

export function SwipeInterface() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (swipeDirection) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setDirection(swipeDirection);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % profiles.length);
  };

  const handleConnect = () => handleSwipe(1);
  const handleSkip = () => handleSwipe(-1);

  return (
    <div className="bg-black flex flex-col items-center justify-center w-full mx-auto sm:w-[400px] h-[500px] rounded-2xl shadow-lg ">
      <AnimatePresence
        custom={direction}
        mode="wait"
        onExitComplete={() => {
          setIsTransitioning(false);
        }}
      >
        <motion.div
          key={currentProfile._id}
          initial={{opacity:0,x:50}}
          animate={{opacity:1,x:0}}
          
          transition={{  duration: 0.8 ,delay:0.2 }}
        >
          <ProfileCard profile={currentProfile} isDisabled={isTransitioning} />
        </motion.div>
      </AnimatePresence>

      <motion.div 
      initial={{opacity:0,x:50}}
      animate={{opacity:1,x:0}}
      transition={{  duration: 0.8 ,delay:0.2 }}
      className="mt-6 w-full flex justify-center">
        <ActionButtons onConnect={handleConnect} onSkip={handleSkip} />
      </motion.div>
    </div>
  );
}