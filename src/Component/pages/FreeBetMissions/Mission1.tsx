/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
------------------------------------------------------------------ */

import { useUserGame }       from "../../../store/useUserGame";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";

interface Mission1Props {
  onBack   : () => void;
  onCollect?: () => void;
}

const Mission1: React.FC<Mission1Props> = ({ onBack, onCollect }) => {
  const {
    hasDeposited,
    depositCents,
    setMission1,
  } = useUserGame();

  /* 1️⃣  Encore en cours de bootstrap → petit spinner */
  if (hasDeposited === undefined) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#160028]/90">
        <p className="text-white animate-pulse">Loading…</p>
      </div>
    );
  }

  /* 2️⃣  Collect reste inchangé */
  const tg     = window.Telegram?.WebApp;
  const token  = tg?.initData || "";
  const apiURL = import.meta.env.VITE_BACKEND_URL;

  const handleCollect = async () => {
    if (!token) return;
    onCollect?.();

    try {
      const r = await fetch(`${apiURL}/api/mission1/collect`, {
        method : "POST",
        headers: { Authorization: `tma ${token}` },
      });
      if (!r.ok) return;
      const { data } = await r.json();
      setMission1({ unlocked: data.unlockedParts, claimed: data.claimedParts });
    } catch (e) {
      console.error("❌ /mission1/collect :", e);
    }
  };

  /* 3️⃣  Rendu normal */
  return hasDeposited && depositCents !== undefined ? (
    <Mission1AfterDeposit onBack={onBack} onCollect={handleCollect} />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
