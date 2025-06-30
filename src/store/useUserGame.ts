// src/store/useUserGame.ts
import { create } from "zustand";

interface UserGameState {
  /* — Dépôt — */
  hasDeposited?: boolean;
  depositCents?: number;

  /* — Mission 1 — */
  mission1?: {
    unlockedParts: number;
    claimedParts : number;
  };

  /* — Mutateurs — */
  setDepositInfo: (v: { has: boolean; cents: number }) => void;
  setMission1   : (v: { unlocked: number; claimed: number }) => void;
}

export const useUserGame = create<UserGameState>((set) => ({
  /* Enregistre le statut du dépôt (utilisé dans App.tsx) */
  setDepositInfo: ({ has, cents }) =>
    set({ hasDeposited: has, depositCents: cents }),

  /* Met à jour l’avancement de la Mission 1 */
  setMission1: ({ unlocked, claimed }) =>
    set(() => ({
      mission1: { unlockedParts: unlocked, claimedParts: claimed },
    })),
}));
