/* ===========================================================================
   src/Component/pages/FreeBetMissions/Mission1.tsx
   Harmonised with the new design system ✨
   ========================================================================== */

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";

interface Mission1Props {
  onBack: () => void;
  onCollect: () => void;
  hasDeposited: boolean | undefined; // undefined ➜ unknown / loading
  depositAmount?: number;
}

/* ------------------------------------------------------------------ */
/*                           Main component                           */
/* ------------------------------------------------------------------ */
const Mission1: React.FC<Mission1Props> = ({
  onBack,
  onCollect,
  hasDeposited: initHasDeposited,
  depositAmount: initDepositAmt,
}) => {
  /* --------------------------- state -------------------------- */
  const [hasDeposited,  setHasDeposited]  = useState(initHasDeposited);
  const [depositAmount, setDepositAmount] = useState<number | null>(
    initDepositAmt ?? null,
  );
  const [loading,       setLoading]       = useState(
    initHasDeposited === undefined,
  );

  /* ---------------------- helpers ----------------------------- */
  const updateStatus = useCallback((has: boolean, amt?: number) => {
    setHasDeposited(has);
    if (has && typeof amt === "number") setDepositAmount(amt);
  }, []);

  /* ----------------------- effects ---------------------------- */
  useEffect(() => {
    /* sync props ➜ state if parent refreshes */
    setHasDeposited(initHasDeposited);
    setDepositAmount(initDepositAmt ?? null);
    setLoading(initHasDeposited === undefined);
  }, [initHasDeposited, initDepositAmt]);

  useEffect(() => {
    const tg  = window.Telegram?.WebApp;
    const id  = (tg?.initDataUnsafe as any)?.user?.id as number | undefined;
    const jwt = tg?.initData;

    if (!id || !jwt) {
      setLoading(false);
      return;
    }

    let socket: Socket | null = null;

    /* --------- REST check --------- */
    const fetchStatus = async () => {
      try {
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/deposit-status`,
          { headers: { Authorization: `tma ${jwt}` } },
        );
        if (!r.ok) throw new Error();
        const j = await r.json();
        updateStatus(j.hasDeposited, j.depositAmount);
      } catch {
        updateStatus(false);
      } finally {
        setLoading(false);
      }
    };

    if (initHasDeposited === undefined) fetchStatus();
    else setLoading(false);

    /* --------- live socket --------- */
    socket = io(import.meta.env.VITE_BACKEND_URL, {
      query: { telegramId: String(id) },
      transports: ["websocket"],
    });

    socket.on("first-deposit", ({ amount }: { amount: number }) => {
      updateStatus(true, amount);
    });

    /* cleanup */
    return () => {
      socket?.disconnect();
    };
  }, [initHasDeposited, updateStatus]);

  /* ----------------------- render ----------------------------- */
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#160028]/80 backdrop-blur">
        <p className="animate-pulse text-sm text-white/80">Checking mission…</p>
      </div>
    );
  }

  /* after / before variants */
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
