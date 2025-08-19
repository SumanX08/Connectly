import { useState } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import  ProfileCard  from './ProfileCard.jsx';
import ActionButtons from './ActionButtons.jsx';// import { BottomNavigation } from './BottomNavigation'; // hidden for demo preview

const profiles = [
  {
    _id: '1',
    age:25,
    username: 'Alex Thompson',
    location: 'Seattle, WA',
    avatar: 'https://avatars.unsplash.com/photo-1731951039706-0e793240bb32?...',
    bio: 'Product manager with 7+ years of experience launching successful digital products...',
    skills: ['Product Management', 'Agile', 'Strategy'],
    lookingFor: ['Analytics', 'UX design', 'Cloud']
  },
  {
    _id: '2',
    username: 'Sarah Chen',
    location: 'San Francisco, CA',
    avatar: 'https://avatars.unsplash.com/photo-1743605691943-dadce3cb4037?...',
    bio: 'Senior UX Designer passionate about creating intuitive digital experiences...',
    skills: ['UX Design', 'Figma', 'Research'],
    lookingFor: ['Frontend Dev', 'Product Management', 'Startup']
  },
  {
    _id: '3',
    username: 'Marcus Johnson',
    location: 'Austin, TX',
    avatar: 'https://avatars.unsplash.com/photo-1543132220-7bc04a0e790a?...',
    bio: 'Full-stack developer with expertise in React and Node.js...',
    skills: ['React', 'Node.js', 'TypeScript'],
    lookingFor: ['Product Manager', 'Designer', 'DevOps']
  }
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? -1000 : 1000,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? -1000 : 1000,
    opacity: 0,
    scale: 0.8,
  }),
};

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
    <div className="bg-black flex flex-col items-center justify-center w-[80vw] sm:w-[400px] h-[500px] rounded-2xl shadow-lg p-4">
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

      {/* ✅ Responsive Action Buttons */}
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