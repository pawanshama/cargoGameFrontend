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
  onBack        : () => void;
  onCollect?    : () => void;     // ouvre le pop-up succès
  hasDeposited? : boolean;        // pré-chargé par la page parente
  depositCents? : number | null;  // pré-chargé par la page parente
}

/*───────────────────────────────────────────────────────────*/
const Mission1: React.FC<Mission1Props> = (props) => {
  const { onBack, onCollect, hasDeposited, depositCents } = props;

  /* ───────── état local (initialisé avec les props) ───────── */
  const [depDone, setDepDone]         = useState<boolean | undefined>(hasDeposited);
  const [depositAmt, setDepositAmt]   = useState<number | null>(depositCents ?? null);
  const [unlocked,   setUnlocked]     = useState(0);
  const [claimed,    setClaimed]      = useState(0);
  const [loading,    setLoading]      = useState(hasDeposited === undefined);

  /* helpers */
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

      setUnlocked(d.unlockedParts);
      setClaimed(d.claimedParts);
      if (d.depositCents && depositAmt === null) setDepositAmt(d.depositCents);
    } catch {/* ignore */ }
  }, [token, apiURL, depositAmt]);

  /* ───────── POST /mission1/collect (optimistic) ───────── */
  const handleCollect = () => {
    if (!token) return;

    /* 1️⃣  pop-up instantané */
    onCollect?.();

    /* 2️⃣  requête en tâche de fond */
    fetch(`${apiURL}/api/mission1/collect`, {
      method : "POST",
      headers: { Authorization: `tma ${token}` },
    })
      .then(() => fetchMissionStatus())
      .catch((err) => console.error("❌ /mission1/collect :", err));
  };

  /* ───────── effet principal ───────── */
  useEffect(() => {
    const uid = (tg?.initDataUnsafe as any)?.user?.id as number | undefined;
    if (!token || !uid) { setLoading(false); return; }

    /* 1️⃣  dépôt déjà fait ? (si pas fourni par la page parente) */
    if (depDone === undefined) {
      (async () => {
        try {
          const r = await fetch(
            `${apiURL}/api/user/deposit-status`,
            { headers: { Authorization: `tma ${token}` } },
          );
          if (r.ok) {
            const j = await r.json();
            if (j.hasDeposited && typeof j.depositAmount === "number") {
              setDepDone(true);
              setDepositAmt(j.depositAmount);
              await fetchMissionStatus();
            } else {
              setDepDone(false);
            }
          }
        } finally {
          setLoading(false);
        }
      })();
    } else {
      /* Les infos étaient déjà là → pas de spinner */
      setLoading(false);
      if (depDone) fetchMissionStatus();
    }

    /* 2️⃣  WebSocket pour détecter le premier dépôt */
    const socket: Socket = io(apiURL, {
      query: { telegramId: String(uid) },
      transports: ["websocket"],
    });

    socket.on("first-deposit", async (p: { amount: number }) => {
      setDepDone(true);
      setDepositAmt(p.amount);
      await fetchMissionStatus();
    });

    /* cleanup */
    return () => { socket.disconnect(); };
  }, [token, apiURL, depDone, fetchMissionStatus]);

  /* ───────── rendu ───────── */
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#160028]/90 z-50">
        <p className="text-white animate-pulse">Loading…</p>
      </div>
    );
  }

  return depDone && depositAmt !== null ? (
    <Mission1AfterDeposit
      onBack={onBack}
      onCollect={handleCollect}
      depositAmount={depositAmt}
      unlockedParts={unlocked}
      claimedParts={claimed}
    />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
