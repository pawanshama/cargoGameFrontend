/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
   ------------------------------------------------------------------ */

import { useEffect, useState, useCallback } from "react";
import Mission1BeforeDeposit  from "./Mission1BeforeDeposit";
import Mission1AfterDeposit   from "./Mission1AfterDeposit";
import { io, Socket }         from "socket.io-client";

/*────────────── types ──────────────*/
interface Mission1StatusPayload {
  unlockedParts : number;   // 0-5
  claimedParts  : number;   // 0-5
  depositCents  : number;   // premier dépôt (sécurité)
}

interface Mission1Props {
  onBack         : () => void;
  onCollect?     : () => void;          // 👉 pour déclencher le popup côté parent
  hasDeposited?  : boolean;             // valeur initiale (optionnelle)
  depositAmount? : number;              // valeur initiale (optionnelle, en cents)
}

/*────────────── composant ──────────────*/
const Mission1: React.FC<Mission1Props> = ({
  onBack,
  onCollect,
  hasDeposited: initDep,
  depositAmount: initAmt,
}) => {
  /* ------------------------------ état ------------------------------ */
  const [hasDeposited,  setDep]  = useState<boolean | undefined>(initDep);
  const [depositCents,  setAmt]  = useState<number | null>(initAmt ?? null);
  const [unlocked,      setUnl]  = useState<number>(0);
  const [claimed,       setClm]  = useState<number>(0);
  const [loading,       setLoad] = useState(initDep === undefined);

  /* ---------------------------- helpers ----------------------------- */
  const tg      = window.Telegram?.WebApp;
  const token   = tg?.initData;
  const headers: Record<string, string> = token ? { Authorization: `tma ${token}` } : {};

  /** Récupère l’état complet de la mission 1 (unlocked / claimed). */
  const fetchMissionStatus = useCallback(async () => {
    if (!token) return;
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/mission1/status`,
        { headers },
      );
      if (!resp.ok) return;
      const { data } = await resp.json();
      const d = data as Mission1StatusPayload;
      setUnl(d.unlockedParts);
      setClm(d.claimedParts);
      if (d.depositCents && depositCents === null) setAmt(d.depositCents);
    } catch {/* silence */}
  }, [token, depositCents]);

  /** POST /collect puis rafraîchit l’état. */
  const handleCollect = async () => {
    if (!token) return;
    try {
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/mission1/collect`,
        { method: "POST", headers },
      );
      await fetchMissionStatus();           // met à jour l’UI
      onCollect?.();                        // informe le parent (ouvre popup)
    } catch (err) {
      console.error("❌ collect :", err);
    }
  };

  /* ------------------------- effet principal ------------------------ */
  useEffect(() => {
    const uid = (tg?.initDataUnsafe as any)?.user?.id as number | undefined;
    if (!token || !uid) { setLoad(false); return; }

    /* 1️⃣ Vérifie s’il existe déjà un dépôt --------------------------- */
    const checkDeposit = async () => {
      try {
        const r = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/deposit-status`,
          { headers },
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
      } catch {/* ignore */ }
      setLoad(false);
    };

    /* Appel initial : seulement si le parent ne nous l’a pas déjà fourni. */
    if (initDep === undefined) {
      void checkDeposit();
    } else {
      if (initDep) void fetchMissionStatus();
      setLoad(false);
    }

    /* 2️⃣ WebSocket pour détecter le tout premier dépôt --------------- */
    const socket: Socket = io(import.meta.env.VITE_BACKEND_URL, {
      query: { telegramId: String(uid) },
      transports: ["websocket"],
    });

    socket.on("first-deposit", async (p: { amount: number }) => {
      setDep(true);
      setAmt(p.amount);
      await fetchMissionStatus();
    });

    /* cleanup */
    return () => {
      socket.disconnect();
    };
  }, [initDep, fetchMissionStatus]);

  /* ----------------------------- rendu ------------------------------ */
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
