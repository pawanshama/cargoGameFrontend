/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
   ------------------------------------------------------------------ */

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";
import { useUserGame }       from "../../../store/useUserGame";

/*────────── Types ──────────*/
interface Mission1StatusPayload {
  unlockedParts : number;
  claimedParts  : number;
  depositCents  : number;
}

interface Mission1Props {
  onBack   : () => void;
  onCollect?: () => void;              // ouvre le pop-up succès
}

/*───────────────────────────────────────────────────────────*/
const Mission1: React.FC<Mission1Props> = ({ onBack, onCollect }) => {
  /* --------- store global --------- */
  const {
    hasDeposited,
    depositCents,
    mission1,
    setDepositInfo,
    setMission1,
  } = useUserGame();

  /* --------- dérivés --------- */
  const unlocked = mission1?.unlockedParts ?? 0;
  const claimed  = mission1?.claimedParts  ?? 0;

  /* --------- loader --------- */
  const [loading, setLoading] = useState(hasDeposited === undefined);

  /* --------- helpers --------- */
  const tg     = window.Telegram?.WebApp;
  const token  = tg?.initData || "";
  const apiURL = import.meta.env.VITE_BACKEND_URL;

  /* =================== helpers API =================== */
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

      setMission1({ unlocked: d.unlockedParts, claimed: d.claimedParts });

      if (d.depositCents && depositCents === undefined) {
        setDepositInfo({ has: true, cents: d.depositCents });
      }
    } catch {
      /* silencieux */
    }
  }, [apiURL, token, depositCents, setMission1, setDepositInfo]);

  const handleCollect = () => {
    if (!token) return;

    onCollect?.();   // pop-up immédiat

    fetch(`${apiURL}/api/mission1/collect`, {
      method : "POST",
      headers: { Authorization: `tma ${token}` },
    })
      .then(() => fetchMissionStatus())
      .catch((e) => console.error("❌ /mission1/collect :", e));
  };

  /* ============ effet 1 : dépôt + spinner ============ */
  useEffect(() => {
    const uid = (tg?.initDataUnsafe as any)?.user?.id as number | undefined;
    if (!token || !uid) { setLoading(false); return; }

    if (hasDeposited === undefined) {
      (async () => {
        try {
          const r = await fetch(
            `${apiURL}/api/user/deposit-status`,
            { headers: { Authorization: `tma ${token}` } },
          );
          if (r.ok) {
            const j = await r.json();
            setDepositInfo({ has: j.hasDeposited, cents: j.depositAmount });
            if (j.hasDeposited) await fetchMissionStatus();
          }
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
      if (hasDeposited) fetchMissionStatus();
    }
  }, [apiURL, token, hasDeposited, fetchMissionStatus, setDepositInfo]);

  /* ============ effet 2 : WebSocket premier dépôt ============ */
  useEffect(() => {
    const uid = (tg?.initDataUnsafe as any)?.user?.id as number | undefined;
    if (!token || !uid) return;

    const socket: Socket = io(apiURL, {
      query     : { telegramId: String(uid) },
      transports: ["websocket"],
    });

    socket.on("first-deposit", async (p: { amount: number }) => {
      setDepositInfo({ has: true, cents: p.amount });
      await fetchMissionStatus();
    });

    /* cleanup : retourne void  */
    return () => { socket.disconnect(); };
  }, [apiURL, token, fetchMissionStatus, setDepositInfo]);

  /* =================== rendu =================== */
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
      unlockedParts={unlocked}
      claimedParts={claimed}
    />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
