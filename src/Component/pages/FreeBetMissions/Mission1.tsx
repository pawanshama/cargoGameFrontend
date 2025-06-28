/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
   ------------------------------------------------------------------ */
import { useEffect, useState } from "react";
import Mission1BeforeDeposit  from "./Mission1BeforeDeposit";
import Mission1AfterDeposit   from "./Mission1AfterDeposit";
import { io, Socket }         from "socket.io-client";

/*────────────── types ──────────────*/
interface Mission1StatusPayload {
  unlockedParts : number;   // 0-5
  claimedParts  : number;   // 0-5
  depositCents  : number;
}

interface Mission1Props {
  onBack: () => void;
}

/*────────────── composant ──────────────*/
const Mission1: React.FC<Mission1Props> = ({ onBack }) => {
  /* --- état --------------------------------------------------- */
  const [hasDeposited, setDep]  = useState<boolean | undefined>();
  const [depositCents, setAmt]  = useState<number | null>(null);
  const [unlocked,     setUnl]  = useState<number>(0);
  const [claimed,      setClm]  = useState<number>(0);
  const [loading,      setLoad] = useState(true);

  /* --- helpers ------------------------------------------------ */
  const tg      = window.Telegram?.WebApp;
  const token   = tg?.initData;
  const baseUrl = import.meta.env.VITE_BACKEND_URL as string;

  /** fabrique proprement les options fetch avec header auth si dispo */
  const authOpts = (): RequestInit | undefined =>
    token ? { headers: { Authorization: `tma ${token}` } } : undefined;

  /** Récupère unlocked / claimed auprès du backend */
  const fetchMissionStatus = async () => {
    if (!token) return;
    const resp = await fetch(`${baseUrl}/api/mission1/status`, authOpts());
    if (!resp.ok) return;
    const { data } = await resp.json();
    const d: Mission1StatusPayload = data;
    setUnl(d.unlockedParts);
    setClm(d.claimedParts);
    if (d.depositCents && depositCents === null) setAmt(d.depositCents);
  };

  /** POST collect puis refresh */
  const handleCollect = async () => {
    if (!token) return;
    await fetch(`${baseUrl}/api/mission1/collect`, {
      method : "POST",
      ...authOpts(),
    });
    await fetchMissionStatus();
  };

  /* --- effet initial + websocket ----------------------------- */
  useEffect(() => {
    const uid = (tg?.initDataUnsafe as any)?.user?.id as number | undefined;

    if (!token || !uid) { setLoad(false); return; }

    /* 1. Vérifie si dépôt déjà effectué ------------------------ */
    const checkDeposit = async () => {
      try {
        const r = await fetch(`${baseUrl}/api/user/deposit-status`, authOpts());
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
      } catch {/* mute erreurs réseau */}
      setLoad(false);
    };
    void checkDeposit();

    /* 2. WebSocket first-deposit -------------------------------- */
    let socket: Socket | null = null;
    socket = io(baseUrl, {
      query      : { telegramId: String(uid) },
      transports : ["websocket"],
    });

    socket.on("first-deposit", async (p: { amount: number }) => {
      setDep(true);
      setAmt(p.amount);
      await fetchMissionStatus();
    });

    /* cleanup */
    return () => { socket?.disconnect(); };   // ← retourne bien void
  }, []);                                     // eslint-disable-line react-hooks/exhaustive-deps

  /* --- rendu -------------------------------------------------- */
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
