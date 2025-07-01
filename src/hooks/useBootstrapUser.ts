// src/hooks/useBootstrapUser.ts
// ------------------------------------------------------------
// Pré-charge dépôt + Mission 1, puis alimente à la fois
// le store Zustand *et* le cache React-Query.
// ------------------------------------------------------------

import { useEffect } from "react";
import { useUserGame } from "../store/useUserGame";
import { useQueryClient } from "@tanstack/react-query";
import { mission1Key } from "./useMission1Query";

export const useBootstrapUser = () => {
  const { setDepositInfo, setMission1 } = useUserGame();
  const qc = useQueryClient();

  const tg     = window.Telegram?.WebApp;
  const token  = tg?.initData || "";
  const apiURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        /* 1️⃣  Dépôt — toujours */
        const depRes = await fetch(`${apiURL}/api/user/deposit-status`, {
          headers: { Authorization: `tma ${token}` },
        });
        if (!depRes.ok) return;
        const dep = await depRes.json();

        setDepositInfo({ has: dep.hasDeposited, cents: dep.depositAmount });

        /* 2️⃣  Mission 1 — seulement si un premier dépôt existe */
        if (dep.hasDeposited) {
          const misRes = await fetch(`${apiURL}/api/mission1/status`, {
            headers: { Authorization: `tma ${token}` },
          });
          if (!misRes.ok) return;

          const { data } = await misRes.json();        // payload réel
          setMission1({
            unlocked: data.unlockedParts,
            claimed : data.claimedParts,
          });

          // 3️⃣  Prime le cache React-Query → invalider plus tard ⤵
          qc.setQueryData(mission1Key, data);
        }
      } catch (err) {
        console.error("❌ bootstrap error :", err);
      }
    })();
  }, [token, apiURL, setDepositInfo, setMission1, qc]);
};
