/* --------------------------------------------------------------------------
   src/hooks/useMission1.ts
   -------------------------------------------------------------------------- */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/* Clé unique de cache : réutilise-la partout */
export const mission1Key = ["mission1-status"];

interface Mission1Status {
  depositAmount : number;  // en cents
  unlockedParts : number;  // 0-5
  claimedParts  : number;  // 0-5
}

/**
 * Récupère (et met en cache) l’avancement de la mission 1.
 * - staleTime : 60 s → pas de requête tant que le cache est ‘frais’
 */
export default function useMission1() {
  return useQuery<Mission1Status>({
    queryKey: mission1Key,
    queryFn : async () => {
      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) throw new Error("initData missing");

      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/missions/1/status`,
        { headers: { Authorization: `tma ${initData}` } },
      );
      return data as Mission1Status;
    },
    staleTime: 60_000,        // 1 minute
  });
}
