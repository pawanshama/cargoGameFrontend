// src/hooks/useMission1.ts
// ------------------------------------------------------------
// Hook centralisé – **compatible React‑Query v4** (signature à 3 arguments).
// Si plus tard tu passes en v5, tu pourras revenir à la syntaxe « objet ».
// ------------------------------------------------------------
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserGame } from "../store/useUserGame";

export const mission1Key = ["mission1-status"] as const;

/** Alignée sur la réponse backend */
export interface Mission1Status {
  depositCents : number;   // Montant du 1ᵉʳ dépôt (en cents)
  unlockedParts: number;   // Paliers déjà débloqués (0‑5)
  claimedParts : number;   // Paliers déjà réclamés  (0‑5)
}

export default function useMission1() {
  const { setMission1, setDepositInfo } = useUserGame();

  return useQuery<Mission1Status, Error, Mission1Status>(
    /* 1️⃣ Clé */
    mission1Key,

    /* 2️⃣ Fonction de requête */
    async (): Promise<Mission1Status> => {
      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) throw new Error("Telegram initData missing");

      const { data } = await axios.get<Mission1Status>(
        `${import.meta.env.VITE_BACKEND_URL}/api/mission1/status`,
        { headers: { Authorization: `tma ${initData}` } }
      );

      return data;
    },

    /* 3️⃣ Options */
    {
      staleTime: 60_000, // 1 minute : pas de refetch tant que c'est « frais »
      onSuccess: (data: Mission1Status) => {
        // Propagation immédiate au store Zustand → rendu instantané
        setMission1({ unlocked: data.unlockedParts, claimed: data.claimedParts });
        setDepositInfo({ has: data.depositCents > 0, cents: data.depositCents });
      },
    }
  );
}
