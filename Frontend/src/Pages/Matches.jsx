import React, { useEffect } from 'react';
import MatchedCard from '../Components/MatchedCard';
import useMatchedStore from "../../Stores/useMatchedStore"
import axios from 'axios';
import { API_URL } from "../config";


// Example matched users data


function Matches() {
  const matchedProfiles = useMatchedStore((state) => state.matchedProfiles)
  const setMatchedProfiles = useMatchedStore((state) => state.setMatchedProfiles);

  useEffect( () => {
    try {
      const fetchMatches=async()=>{
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/connections/matches`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Pass token here
        }
      })
      console.log(res.data)
      setMatchedProfiles(res.data.matches);
    }
    fetchMatches()

    } catch (error) {
      console.error(error)

    }
  }, [])

  return (
    <div className=" pt-8 min-h-screen px-4">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 md:max-w-6xl max-w-4xl  mx-auto mt-10">
        {Array.isArray(matchedProfiles)&&matchedProfiles?.map((user, idx) => (
          <MatchedCard key={idx} {...user} />
        ))}
      </div>
    </div>
  );
}



export default Matches;