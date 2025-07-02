// src/hooks/useBootstrapUser.ts
// ------------------------------------------------------------
// Pré-charge uniquement le statut dépôt et alimente le store
// ------------------------------------------------------------
import { useEffect } from "react";
import { useUserGame } from "../store/useUserGame";

export const useBootstrapUser = () => {
  const { setDepositInfo } = useUserGame();

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
      } catch (err) {
        console.error("❌ bootstrap error :", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, apiURL]);
};
