import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      setUser: (userData, token) =>{
        localStorage.setItem("token", token)
        localStorage.setItem("user", userData._id)
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
        });
      },

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      setLoading: (value) => set({ loading: value }),
    }),
    {
      name: "auth-store", // stored in localStorage
    }
  )
);

export default useAuthStore;
