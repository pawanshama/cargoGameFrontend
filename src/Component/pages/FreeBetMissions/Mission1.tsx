/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
   ------------------------------------------------------------------ */
import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";

import { useUserGame } from "../../../store/useUserGame";

interface Mission1StatusPayload {
  unlockedParts : number;
  claimedParts  : number;
  depositCents  : number;
}

interface Mission1Props {
  onBack     : () => void;
  onCollect? : () => void;
}

/*───────────────────────────────────────────────────────────*/
const Mission1: React.FC<Mission1Props> = ({ onBack, onCollect }) => {
  /* ───────── données globales ───────── */
  const {
    hasDeposited,
    depositCents,
    
    setDepositInfo,
    setMission1,
  } = useUserGame();

  /* spinner uniquement si l’app n’a jamais chargé */
  const [loading, setLoading] = useState(hasDeposited === undefined);

  const tg     = window.Telegram?.WebApp;
  const token  = tg?.initData || "";
  const apiURL = import.meta.env.VITE_BACKEND_URL;

  /* ───────── GET /mission1/status ───────── */
  const fetchMissionStatus = useCallback(async () => {
    if (!token) return;
    try {
      const r = await fetch(
        `${apiURL}/api/mission1/status`,
        { headers: { Authorization: `tma ${token}` } },
      );
      if (!r.ok) return;
      const { data } = await r.json();
      const d = data as Mission1StatusPayload;

      /* maj store */
      setMission1({ unlocked: d.unlockedParts, claimed: d.claimedParts });
      if (d.depositCents && depositCents === undefined) {
        setDepositInfo({ has: true, cents: d.depositCents });
      }
    } catch {/* ignore */ }
  }, [token, apiURL, setMission1, setDepositInfo, depositCents]);

  /* ───────── POST /mission1/collect (optimistic) ───────── */
  const handleCollect = () => {
    if (!token) return;
    onCollect?.();                   // popup instantanée
    fetch(`${apiURL}/api/mission1/collect`, {
      method : "POST",
      headers: { Authorization: `tma ${token}` },
    })
      .then(() => fetchMissionStatus())
      .catch((e) => console.error("❌ /mission1/collect :", e));
  };

  /* ───────── premier chargement / WebSocket ───────── */
  useEffect(() => {
    const uid = (tg?.initDataUnsafe as any)?.user?.id as number | undefined;
    if (!token || !uid) { setLoading(false); return; }

    /* si dépôt inconnu => questionne l’API une fois */
    if (hasDeposited === undefined) {
      (async () => {
        try {
          const r = await fetch(
            `${apiURL}/api/user/deposit-status`,
            { headers: { Authorization: `tma ${token}` } },
          );
          if (r.ok) {
            const j = await r.json();
            setDepositInfo({
              has  : j.hasDeposited,
              cents: j.depositAmount,
            });
            if (j.hasDeposited) await fetchMissionStatus();
          }
        } finally {
          setLoading(false);
        }
      })();
    } else {
      /* store déjà rempli → pas de spinner */
      setLoading(false);
      if (hasDeposited) fetchMissionStatus();
    }

    /* WebSocket pour 1er dépôt (optionnel) */
    const socket: Socket = io(apiURL, {
      query: { telegramId: String(uid) },
      transports: ["websocket"],
    });
    socket.on("first-deposit", async (p: { amount: number }) => {
      setDepositInfo({ has: true, cents: p.amount });
      await fetchMissionStatus();
    });
    return () => { socket.disconnect(); };
  }, [
    token,
    apiURL,
    hasDeposited,
    fetchMissionStatus,
    setDepositInfo,
  ]);

  /* ───────── rendu ───────── */
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#160028]/90 z-50">
        <p className="text-white animate-pulse">Loading…</p>
      </div>
    );
  }

  return hasDeposited && depositCents !== undefined ? (
    <Mission1AfterDeposit
      onBack={onBack}
      onCollect={handleCollect}
      depositAmount={depositCents}
    />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
