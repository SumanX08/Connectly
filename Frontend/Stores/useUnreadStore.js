import { create } from "zustand";

const useUnreadStore = create((set, get) => ({
  unreadCounts: {},

  // Set multiple counts at once (used on initial fetch)
  setUnreadCounts: (counts) => set({ unreadCounts: counts }),

  incrementUnread: (conversationId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: (state.unreadCounts[conversationId] || 0) + 1,
      },
    }));
  },

  resetUnread: (conversationId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: 0,
      },
    }));
  },

  getTotalUnread: () => {
    const counts = Object.values(get().unreadCounts);
    // Count only conversations with at least 1 unread
    return counts.filter((c) => c > 0).length;
  },
}));

export default useUnreadStore;

