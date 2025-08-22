// src/store/matchedStore.js

import { create } from "zustand";
import { persist } from "zustand/middleware";
import mockProfiles from "../data/mockProfiles.js";
import axios from "axios";
import { API_URL } from "../src/config.js";

const token = localStorage.getItem("token")


const useMatchedStore = create(
  persist(
    (set, get) => ({
      profiles: [], // All swipeable profiles
      matchedProfiles: [],

      matchTopProfile: () => {
  const state = get();
  const topProfile = state.profiles[0];
  if (!topProfile) return;

  set({
    profiles: state.profiles.slice(1),
    matchedProfiles: [...state.matchedProfiles, topProfile],
  });
},

      setMatchedProfiles: (profiles) => set({ matchedProfiles: profiles }),

      resetMatches: () =>
        set({ profiles: [...mockProfiles], matchedProfiles: [] }),

      fetchMatchedProfilesWithLastMessages: async (userId) => {
         if (!userId) return;
        try {
          const res = await axios.get(`${API_URL}/api/connections/matches-with-last-messages/${userId}`,{headers:{Authorization: `Bearer ${token}`}});
          set({ matchedProfiles: res.data });
        } catch (err) {
          console.error("Failed to fetch matches with messages:", err);
        }
      },
    }),
    {
      name: "matched-profiles-storage", // LocalStorage key
    }
  )
);

export default useMatchedStore;
