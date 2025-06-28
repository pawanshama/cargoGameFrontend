import { create } from "zustand";

/* -------- types -------- */
interface AuthState {
  id: string | null;
  username: string | null;
  setUser: (user: { id: string; username: string }) => void;
}

/* -------- store -------- */
export const useAuthStore = create<AuthState>((set) => ({
  id: null,
  username: null,
  setUser: (user) => set(user),
}));
