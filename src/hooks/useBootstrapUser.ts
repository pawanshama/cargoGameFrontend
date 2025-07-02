// src/hooks/useBootstrapUser.ts
// ------------------------------------------------------------
// Pré-charge dépôt + Mission 1, alimente le store Zustand
// et initialise le cache React-Query.
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
        /* 1️⃣  Statut dépôt (toujours) ----------------------- */
        const depRes = await fetch(`${apiURL}/api/user/deposit-status`, {
          headers: { Authorization: `tma ${token}` },
        });
        if (!depRes.ok) return;
        const dep = await depRes.json();
        // L'API peut renvoyer soit depositCents soit depositAmount :
        const amountCents =
          typeof dep.depositCents === "number"
            ? dep.depositCents
            : dep.depositAmount ?? 0;

        const hasDeposit =
          amountCents > 0 || dep.hasDeposited === true;

        /* hydrate store */
        setDepositInfo({ has: hasDeposit, cents: amountCents });

        /* 2️⃣  Mission 1 si dépôt présent -------------------- */
        if (hasDeposit) {
          const misRes = await fetch(`${apiURL}/api/mission1/status`, {
            headers: { Authorization: `tma ${token}` },
          });
          if (!misRes.ok) return;

          const { data } = await misRes.json(); // payload front-ready

          /* hydrate store */
          setMission1({
            unlockedParts: data.unlockedParts,
            claimedParts : data.claimedParts,
          });

          /* met à jour cache React-Query pour invalidation future */
          qc.setQueryData(mission1Key, data);

          /* bonus : si l’API renvoie aussi depositCents, ajuste */
          if (typeof data.depositCents === "number") {
            setDepositInfo({
              has  : data.depositCents > 0,
              cents: data.depositCents,
            });
          }
        }
      } catch (err) {
        console.error("❌ bootstrap error :", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, apiURL]); // setters et qc sont stables
};
//