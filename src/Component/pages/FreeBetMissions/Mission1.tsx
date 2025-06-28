/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
   ------------------------------------------------------------------ */

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";

/*──────── types ────────*/
interface Mission1StatusPayload {
  unlockedParts : number;
  claimedParts  : number;
  depositCents  : number;
}

/*──────── props ────────*/
interface Mission1Props {
  onBack    : () => void;
  onCollect?: () => void;          // ouvre le popup succès
}

/*───────────────────────────────────────────────────────────*/
const Mission1: React.FC<Mission1Props> = ({ onBack, onCollect }) => {
  /* état */
  const [hasDeposited, setDep]  = useState<boolean | undefined>();
  const [depositCents, setAmt]  = useState<number | null>(null);
  const [unlocked,     setUnl]  = useState(0);
  const [claimed,      setClm]  = useState(0);
  const [loading,      setLoad] = useState(true);

  /* helpers */
  const tg     = window.Telegram?.WebApp;
  const token  = tg?.initData;
  const apiURL = import.meta.env.VITE_BACKEND_URL;

  /* GET /mission1/status */
  const fetchMissionStatus = useCallback(async () => {
    if (!token) return;

    try {
      const r = await fetch(
        `${apiURL}/api/mission1/status`,
        { headers: { Authorization: `tma ${token}` } },   // headers *seulement* si token
      );
      if (!r.ok) return;
      const { data } = await r.json();
      const d = data as Mission1StatusPayload;
      setUnl(d.unlockedParts);
      setClm(d.claimedParts);
      if (d.depositCents && depositCents === null) setAmt(d.depositCents);
    } catch {/* ignore */ }
  }, [token, apiURL, depositCents]);

  /* POST /mission1/collect */
  const handleCollect = async () => {
    if (!token) return;
    try {
      await fetch(
        `${apiURL}/api/mission1/collect`,
        { method: "POST", headers: { Authorization: `tma ${token}` } },
      );
      await fetchMissionStatus();
      onCollect?.();
    } catch (err) { console.error("❌ collect :", err); }
  };

  /* effet principal */
  useEffect(() => {
    const uid = (tg?.initDataUnsafe as any)?.user?.id as number | undefined;
    if (!token || !uid) { setLoad(false); return; }

    /* 1️⃣ dépôt déjà fait ? */
    (async () => {
      try {
        const r = await fetch(
          `${apiURL}/api/user/deposit-status`,
          { headers: { Authorization: `tma ${token}` } },
        );
        if (r.ok) {
          const j = await r.json();
          if (j.hasDeposited && typeof j.depositAmount === "number") {
            setDep(true);
            setAmt(j.depositAmount);
            await fetchMissionStatus();
          } else {
            setDep(false);
          }
        }
      } finally {
        setLoad(false);
      }
    })();

    /* 2️⃣ WebSocket pour détecter le premier dépôt */
    const socket: Socket = io(apiURL, {
      query: { telegramId: String(uid) },
      transports: ["websocket"],
    });

    socket.on("first-deposit", async (p: { amount: number }) => {
      setDep(true);
      setAmt(p.amount);
      await fetchMissionStatus();
    });

    /* cleanup → toujours void */
    return () => { socket.disconnect(); };
  }, [token, apiURL, fetchMissionStatus]);

  /* rendu */
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#160028]/90 z-50">
        <p className="text-white animate-pulse">Loading…</p>
      </div>
    );
  }

  return hasDeposited && depositCents !== null ? (
    <Mission1AfterDeposit
      onBack={onBack}
      onCollect={handleCollect}
      depositAmount={depositCents}
      unlockedParts={unlocked}
      claimedParts={claimed}
    />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
