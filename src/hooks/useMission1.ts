// src/hooks/useMission1.ts
// ------------------------------------------------------------
// Hook centralisé – **compatible React-Query v4**.
// ------------------------------------------------------------
import {
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { useUserGame } from "../store/useUserGame";

/* ---------- Clé de cache ---------- */
export const mission1Key = ["mission1-status"] as const;

/* ---------- Typage de la réponse backend ---------- */
export interface Mission1Status {
  depositCents : number;   // Montant du 1ᵉʳ dépôt (en cents)
  unlockedParts: number;   // Paliers déjà débloqués (0-5)
  claimedParts : number;   // Paliers déjà réclamés  (0-5)
}

/* ---------- Hook ---------- */
export default function useMission1(
  options?: Omit<
    UseQueryOptions<
      Mission1Status,        // TQueryFnData
      Error,                 // TError
      Mission1Status         // TData (sélecteur)
    >,
    "queryKey" | "queryFn"
  >
) {
  const { setMission1, setDepositInfo } = useUserGame();

  return useQuery<Mission1Status, Error, Mission1Status>(
    /* 1️⃣ Clé  */
    mission1Key,

    /* 2️⃣ Fonction de requête  */
    async (): Promise<Mission1Status> => {
      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) throw new Error("Telegram initData missing");

      const { data } = await axios.get<Mission1Status>(
        `${import.meta.env.VITE_BACKEND_URL}/api/mission1/status`,
        { headers: { Authorization: `tma ${initData}` } }
      );

      return data;
    },

    /* 3️⃣ Options */
    {
      staleTime: 60_000, // 1 min : ne refetch pas tant que « frais »
      onSuccess: (d) => {
        // Hydrate immédiatement le store Zustand → rendu instantané
        setMission1({ unlocked: d.unlockedParts, claimed: d.claimedParts });
        setDepositInfo({ has: d.depositCents > 0, cents: d.depositCents });
      },
      retry: false,
      ...options,        // écrase / complète si le caller passe des options
    }
  );
}
