// src/Stores/useFilterStore.js
import { create } from 'zustand';

const useFilterStore = create((set) => ({
  filters: {
    skills: [],
    location: '',
    ageRange: [, ],
  },
  setSkills: (skills) =>
    set((state) => ({ filters: { ...state.filters, skills } })),
  setLocation: (location) =>
    set((state) => ({ filters: { ...state.filters, location } })),
  setAgeRange: (ageRange) =>
    set((state) => ({ filters: { ...state.filters, ageRange } })),
}));

export default useFilterStore;
