import { create } from 'zustand'

const useUserStore = create((set) => ({
  token: null,
  userLevel: null,
  setUser: (token, userLevel) => set(token, parseInt(userLevel)),
  removeAll: () => set({ userLevel: null, token: null }),
}))

export default useUserStore;