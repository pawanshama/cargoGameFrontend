// src/store/useUserGame.ts
// ------------------------------------------------------------------
// Zustand store + persistance locale (localStorage) ✓ TypeScript-safe
// ------------------------------------------------------------------
import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ---------- Types ---------- */
export interface Mission1Progress {
  unlockedParts: number;
  claimedParts : number;
}

export interface UserGameState {
  /* — Dépôt — */
  hasDeposited?: boolean;   // undefined = inconnu, false/true = connu
  depositCents?: number;

  /* — Mission 1 — */
  mission1?: Mission1Progress;

  /* — Mutateurs — */
  setDepositInfo: (v: { has: boolean; cents: number }) => void;
  setMission1   : (v: { unlocked: number; claimed: number }) => void;
  reset         : () => void;
}

/* ---------- État initial (utile pour reset) ---------- */
const initialState: UserGameState = {
  hasDeposited : undefined,
  depositCents : undefined,
  mission1     : undefined,
  setDepositInfo: () => {},
  setMission1   : () => {},
  reset         : () => {},
};

/* ---------- Store ---------- */
export const useUserGame = create<UserGameState>()(
  persist(
    (set) => ({
      /* --- state initialisé --- */
      ...initialState,

      /* ---------- actions ---------- */
      setDepositInfo: ({ has, cents }) =>
        set({ hasDeposited: has, depositCents: cents }),

      setMission1: ({ unlocked, claimed }) =>
        set({
          mission1: { unlockedParts: unlocked, claimedParts: claimed },
        }),

      reset: () => set(initialState, true),   // remplace tout l’état
    }),
    {
      name: "user-game",             // clé localStorage
      partialize: (state) => ({
        hasDeposited : state.hasDeposited,
        depositCents : state.depositCents,
        mission1     : state.mission1,
      }),
      version: 1,
    }
  )
);
