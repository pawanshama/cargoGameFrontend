/* src/Component/pages/FreeBetMissions/Mission1.tsx */

import { useEffect, useState } from "react";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";
import { io, Socket }        from "socket.io-client";

interface Mission1Props {
  onBack: () => void;
  onCollect: () => void;
  hasDeposited: boolean | undefined;   // undefined = inconnu
  depositAmount?: number;
}

const Mission1: React.FC<Mission1Props> = ({
  onBack,
  onCollect,
  hasDeposited: initDep,
  depositAmount: initAmt,
}) => {
  /* -------- état -------- */
  const [hasDeposited,  setDep]   = useState<boolean | undefined>(initDep);
  const [depositAmount, setAmt]   = useState<number | null>(initAmt ?? null);
  const [loading,       setLoad]  = useState(initDep === undefined);

  /* -------- effet -------- */
  useEffect(() => {
    const tg   = window.Telegram?.WebApp;
    const init = tg?.initData;
    const uid  = (tg?.initDataUnsafe as any)?.user?.id as number | undefined;

    /* socket déclaré ici pour être visible dans le cleanup */
    let socket: Socket | null = null;

    /* si infos manquantes, on stoppe tout */
    if (!init || !uid) {
      setLoad(false);
      return () => {};                 // cleanup “vide”
    }

    /* ---- vérifie dépôt ---- */
    const checkDeposit = async () => {
      try {
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/deposit-status`,
          { headers: { Authorization: `tma ${init}` } },
        );
        if (!r.ok) return false;
        const j = await r.json();
        if (j.hasDeposited && typeof j.depositAmount === "number") {
          setDep(true);
          setAmt(j.depositAmount);
        } else {
          setDep(false);
        }
        setLoad(false);
        return true;
      } catch {
        setLoad(false);
        return false;
      }
    };

    /* appel initial uniquement si parent ne l’a pas encore */
    if (initDep === undefined) void checkDeposit();
    else setLoad(false);

    /* ---- WebSocket “first-deposit” ---- */
    socket = io(import.meta.env.VITE_BACKEND_URL, {
      query: { telegramId: String(uid) },
      transports: ["websocket"],
    });

    socket.on("first-deposit", (p: { amount: number }) => {
      setDep(true);
      setAmt(p.amount);
      setLoad(false);
    });

    /* ---- cleanup ---- */
    return () => {
      if (socket) socket.disconnect();
    };
  }, [initDep]);

  /* -------- rendu -------- */
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#160028]/90 z-50">
        <p className="text-white animate-pulse">Loading…</p>
      </div>
    );
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