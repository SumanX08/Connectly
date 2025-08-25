import  { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ProfileCard from '../Components/ProfileCard'
import ActionButtons from '../Components/ActionButtons'
import { useState } from 'react'
import useMatchedStore from "../../Stores/useMatchedStore"
import useProfileStore from '../../Stores/useProfileStore.js'
import axios from 'axios'
import useFilterStore from '../../Stores/useFilterStore';
import qs from 'qs';
import { socket } from '../socket.js'
import { toast } from 'sonner'
import { API_URL } from "../config";

 const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8
    })
  };


function Home() {
  const [direction, setDirection] = useState(0)
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { matchTopProfile, matchedProfiles } = useMatchedStore();
  const { allProfiles, setAllProfiles } = useProfileStore();
  const currentProfile = allProfiles[currentProfileIndex];
  const loggedInUserId = localStorage.getItem("user");
  const { filters } = useFilterStore();


  useEffect(() => {
    if (!loggedInUserId) return;

    socket.connect();

    socket.on("connect", () => {
      socket.emit("join", loggedInUserId);
    });

    return () => {
      socket.disconnect();
    };
  }, [loggedInUserId]);

  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        
        const params = {};

        if (filters.skills.length > 0) {
          params.skills = filters.skills;
        }
        if (filters.location) {
          params.location = filters.location;
        }
        if (filters.ageRange?.length === 2) {
          params.minAge = filters.ageRange[0];
          params.maxAge = filters.ageRange[1];
        }


        const res = await axios.get(`${API_URL}/api/profiles/suggestions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }), 
        });

        setAllProfiles(res.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, [filters]);


  if (allProfiles.length === 0) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <h1 className='text-white text-center text-2xl'>Loading profiles...</h1>
      </div>
    );
  }

  if (!currentProfile) return <div className='min-h-screen flex jusity-center items-center' > <h1 className='text-white text-center text-2xl'>No more profiles</h1></div>;

  const handleSkip = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDirection(-1)
    toast.info("Profile Skipped")

    setCurrentProfileIndex((prev) => {
      const next = prev + 1;
      ("Next profile index:", next);
      return next;
    });

    (currentProfile)
  }
  const handleConnect = async () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    matchTopProfile()
    setDirection(1)

    const receiverId = currentProfile._id

    socket.emit("send-connection", {
      sender: loggedInUserId,
      receiver: receiverId
    })
    (loggedInUserId, receiverId)
    try {
      await axios.post(`${API_URL}/api/connections/connect-request`, {
        senderId: loggedInUserId,
        receiverId
      },{ headers: { Authorization: `Bearer ${token}` }} ,);
      toast.info("Connection request sent");
    } catch (error) {
      console.error("Connect request error:", error.response?.data || error.message);
      toast.info(error.response?.data?.message || "Failed to send request");
    }

    setCurrentProfileIndex((prev) => {
      const next = prev + 1;
      ("Next profile index:", next);
      return next;
    });

    (matchedProfiles)
  }

 

  const isFilterActive =
  (filters.skills && filters.skills.length > 0) ||
  (filters.location && filters.location.trim() !== "") ||
  (filters.ageRange &&
    filters.ageRange.length === 2 &&
    (filters.ageRange[0] != null || filters.ageRange[1] != null));


  return (
    <div className="flex flex-col justify-center items-center min-h-screen ">
      {isFilterActive && (
    <div className="bg-zinc-900 border-gray-500 border-2 text-gray-300 px-4 py-2 rounded-lg mb-4 text-sm text-center">
      <strong>Filtered Profiles:</strong>{" "}
      {filters.skills?.length > 0 && (
        <span>Skills: {filters.skills.join(", ")} </span>
      )}
      {filters.location && <span> | Location: {filters.location} </span>}
      {filters.ageRange?.length === 2 && (
        <span>
          {" "}
          | Age: {filters.ageRange[0]} - {filters.ageRange[1]}
        </span>
      )}
    </div>
  )}
      <AnimatePresence custom={direction} mode='wait' onExitComplete={() => { setIsTransitioning(false) }}>
        <motion.div
          key={currentProfile._id}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
          }}
          className='w-9/10'>
          <ProfileCard profile={currentProfile} isDisabled={isTransitioning} />
        </motion.div>

      </AnimatePresence>

      <ActionButtons onConnect={handleConnect} onSkip={handleSkip} />
    </div>
  )
}



export default Home