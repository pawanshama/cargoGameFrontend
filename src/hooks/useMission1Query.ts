// src/hooks/useMission1Query.ts
// ------------------------------------------------------------
// Récupère le statut Mission 1 et met à jour le store Zustand.
// Empêche un « rollback » en ne diminuant jamais les compteurs.
// ------------------------------------------------------------
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { useUserGame } from "../store/useUserGame";

export const mission1Key = ["mission1-status"] as const;

export interface Mission1Status {
  depositCents: number;
  unlockedParts: number;
  claimedParts: number;
}

export default function useMission1Query(
  options?: Omit<
    UseQueryOptions<Mission1Status, Error, Mission1Status>,
    "queryKey" | "queryFn"
  >,
) {
  const { setMission1, setDepositInfo } = useUserGame();

  return useQuery<Mission1Status, Error, Mission1Status>(
    mission1Key,
    async () => {
      const token = window.Telegram?.WebApp?.initData || "";
      const { data } = await axios.get<Mission1Status>(
        `${import.meta.env.VITE_BACKEND_URL}/api/mission1/status`,
        { headers: { Authorization: `tma ${token}` } },
      );
      console.log("[/mission1/status]", data);
      return data;
    },
    {
      // rafraîchit automatiquement (fallback) — peut être override via options
      staleTime: 5_000,

      // ✅ Fusionne avec les valeurs courantes pour éviter toute régression
      onSuccess: (d) => {
        const { mission1: prev } = useUserGame.getState();
        setMission1({
          unlockedParts: Math.max(prev?.unlockedParts ?? 0, d.unlockedParts),
          claimedParts : Math.max(prev?.claimedParts  ?? 0, d.claimedParts),
        });

        if (d.depositCents > 0) {
          setDepositInfo({ has: true, cents: d.depositCents });
        }
      },

      retry: false,
      ...options,
    },
  );
}