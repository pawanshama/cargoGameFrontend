/* src/Component/pages/FreeBetMissions/Mission1.tsx
   – version TypeScript safe (plus d’erreur TS2339) */

import { useEffect, useState } from "react";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit from "./Mission1AfterDeposit";
import { io as socketIOClient } from "socket.io-client";

interface Mission1Props {
  onBack: () => void;
  onCollect: () => void;
  hasDeposited: boolean;
  depositAmount?: number;
}

const Mission1: React.FC<Mission1Props> = ({
  onBack,
  onCollect,
  hasDeposited: initialHasDeposited,
  depositAmount: initialDepositAmount,
}) => {
  const [hasDeposited, setHasDeposited] = useState(initialHasDeposited);
  const [depositAmount, setDepositAmount] = useState<number | null>(
    initialDepositAmount ?? null,
  );
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------------------- */
  /*                         Effet d’initialisation                        */
  /* -------------------------------------------------------------------- */
  useEffect(() => {
    /* Raccourcis Telegram */
    const tg = window.Telegram?.WebApp;
    const initData = tg?.initData;
    const telegramId: number | undefined = (tg?.initDataUnsafe as any)?.user?.id;

    console.log("📦 initData :", initData);
    console.log("👤 telegramId :", telegramId);

    /* Si infos manquantes → on stoppe tout */
    if (!initData || !telegramId) {
      console.error("❌ initData ou telegramId manquant.");
      setLoading(false);
      return;
    }

    /* ---------- 1. Fonction de fetch déposits ---------- */
    const fetchDeposit = async (): Promise<boolean> => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/deposit-status`,
          { headers: { Authorization: `tma ${initData}` } },
        );

        if (!res.ok) {
          console.error("❌ HTTP deposit-status :", await res.text());
          return false;
        }

        const body = await res.json();
        console.log("🎯 Résultat deposit-status :", body);

        if (body?.hasDeposited && typeof body.depositAmount === "number") {
          setHasDeposited(true);
          setDepositAmount(body.depositAmount);
          return true;
        }
      } catch (err) {
        console.error("❌ Exception fetchDeposit:", err);
      }
      return false;
    };

    /* ---------- 2. Appel immédiat + retry (30 s max) ---------- */
    fetchDeposit().then((ok) => {
      if (!ok) {
        let tries = 0;
        const id = setInterval(async () => {
          const success = await fetchDeposit();
          tries += 1;
          if (success || tries >= 6) clearInterval(id);
        }, 5000);
      }
    });

    /* ---------- 3. WebSocket écoute "first-deposit" ---------- */
    const socket = socketIOClient(
      import.meta.env.VITE_BACKEND_URL,
      {
        query: { telegramId: telegramId.toString() },
        transports: ["websocket"],
      },
    );

    socket.on("connect", () => console.log("🔌 WebSocket connecté"));
    socket.on("disconnect", () => console.log("📴 WebSocket déconnecté"));

    socket.on("first-deposit", (payload: { amount: number }) => {
      console.log("🎁 Event first-deposit :", payload);
      setHasDeposited(true);
      setDepositAmount(payload.amount / 100); // si `amount` est en cents
      setLoading(false);
    });

    /* ---------- 4. Cleanup ---------- */
    return () => {
      socket.disconnect();
      console.log("🧼 Socket proprement fermé");
    };
  }, []); // ← exécuter une seule fois au montage

  /* -------------------------------------------------------------------- */
  /*                               Render                                 */
  /* -------------------------------------------------------------------- */
  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return hasDeposited && depositAmount !== null ? (
    <Mission1AfterDeposit
      onBack={onBack}
      onCollect={onCollect}
      depositAmount={depositAmount}
    />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
