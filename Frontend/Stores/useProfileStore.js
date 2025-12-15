import { create } from "zustand"
import { persist } from "zustand/middleware"

const useProfileStore = create(
  persist(
    (set) => ({
      profile: null,
      allProfiles: [],    
      requests: [],       
      matches: [],        
      setProfile: (profile) => set({ profile }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      setAllProfiles: (profiles) => set({ allProfiles: profiles }),
      setRequests: (requests) => set({ requests }),
      setMatches: (matches) => set({ matches }),

      addRequest: (request) =>
        set((state) => ({ requests: [...state.requests, request] })),

      addMatch: (match) =>
        set((state) => ({ matches: [...state.matches, match] })),

      removeProfileFromList: (id) =>
        set((state) => ({
          allProfiles: state.allProfiles.filter((p) => p._id !== id),
        })),
    }),
    {
      name: "profile-store",
    }
  )
);

export default useProfileStore;
