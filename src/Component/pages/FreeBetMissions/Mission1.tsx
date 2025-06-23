/* src/Component/pages/FreeBetMissions/Mission1.tsx
   – s’affiche instantanément, plus d’erreur TS2345            */

import { useEffect, useState } from "react";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";
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
  /* -------- affichage -------- */
  const [hasDeposited, setHasDeposited]   = useState(initialHasDeposited);
  const [depositAmount, setDepositAmount] = useState<number | null>(
    initialDepositAmount ?? null,
  );

  /* -------- init -------- */
  useEffect(() => {
    const tg         = window.Telegram?.WebApp;
    const initData   = tg?.initData;
    const telegramId = (tg?.initDataUnsafe as any)?.user?.id as
                       number | undefined;

    if (!initData || !telegramId) return;

    /* -- vérifie le premier dépôt -- */
    const fetchDeposit = async (): Promise<boolean> => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/deposit-status`,
          { headers: { Authorization: `tma ${initData}` } },
        );
        if (!res.ok) return false;

        const body = await res.json();
        if (body?.hasDeposited && typeof body.depositAmount === "number") {
          setHasDeposited(true);
          setDepositAmount(body.depositAmount);
          return true;
        }
      } catch {/* ignore */}
      return false;
    };

    /* -- appel immédiat + retry (5 s, max 6) -- */
    (async () => {
      const ok = await fetchDeposit();
      if (!ok) {
        let tries = 0;
        const id = setInterval(async () => {
          const done = await fetchDeposit();
          tries += 1;
          if (done || tries >= 6) clearInterval(id);
        }, 5_000);
      }
    })();

    /* -- WebSocket first-deposit -- */
    const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL, {
      query: { telegramId: telegramId.toString() },
      transports: ["websocket"],
    });

    socket.on("first-deposit", (p: { amount: number }) => {
      setHasDeposited(true);
      setDepositAmount(p.amount);          // déjà en cents
    });

    /* cleanup – retourne void */
    return () => {
      socket.disconnect();
    };
  }, []);

  /* -------- rendu -------- */
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
