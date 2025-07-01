// src/hooks/useBootstrapUser.ts
import { useEffect } from "react";
import { useUserGame } from "../store/useUserGame";

export const useBootstrapUser = () => {
  const { setDepositInfo, setMission1 } = useUserGame();

  const tg     = window.Telegram?.WebApp;
  const token  = tg?.initData || "";
  const apiURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        // 1️⃣ dépôt
        const dep = await fetch(`${apiURL}/api/user/deposit-status`, {
          headers: { Authorization: `tma ${token}` },
        }).then(r => r.ok ? r.json() : null);
        if (!dep) return;

        setDepositInfo({ has: dep.hasDeposited, cents: dep.depositAmount });

        // 2️⃣ mission 1 (si nécessaire) – lançée en // pour ne pas bloquer l’UI
        if (dep.hasDeposited) {
          fetch(`${apiURL}/api/mission1/status`, {
            headers: { Authorization: `tma ${token}` },
          })
            .then(r => r.ok ? r.json() : null)
            .then(j => {
              if (!j) return;
              const d = j.data;
              setMission1({ unlocked: d.unlockedParts, claimed: d.claimedParts });
            });
        }
      } catch (e) {
        console.error("bootstrap error", e);
      }
    })();
  }, [token, apiURL, setDepositInfo, setMission1]);
};
