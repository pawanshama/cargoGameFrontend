// src/hooks/useMission1Query.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { useUserGame } from "../store/useUserGame";

export const mission1Key = ["mission1-status"] as const;

export interface Mission1Status {
  depositCents : number;
  unlockedParts: number;
  claimedParts : number;
}

export default function useMission1Query(
  options?: Omit<
    UseQueryOptions<Mission1Status, Error, Mission1Status>,
    "queryKey" | "queryFn"
  >
) {
  const { setMission1, setDepositInfo } = useUserGame();
  return useQuery<Mission1Status, Error, Mission1Status>(
    mission1Key,
    async () => {
      const token = window.Telegram?.WebApp?.initData || "";
      const { data } = await axios.get<Mission1Status>(
        `${import.meta.env.VITE_BACKEND_URL}/api/mission1/status`,
        { headers: { Authorization: `tma ${token}` } }
      );
      return data;
    },
    {
      staleTime: 60_000,
      onSuccess: (d) => {
        setMission1({ unlocked: d.unlockedParts, claimed: d.claimedParts });
         if (d.depositCents > 0) {
   setDepositInfo({ has: true, cents: d.depositCents });
 }
      },
      retry: false,
      ...options,
    }
  );
}
