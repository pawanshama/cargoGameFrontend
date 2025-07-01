/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
------------------------------------------------------------------ */

import { useUserGame }       from "../../../store/useUserGame";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";

interface Mission1Props {
  onBack   : () => void;
  onCollect?: () => void; // pop-up succès
}

const Mission1: React.FC<Mission1Props> = ({ onBack, onCollect }) => {
  const {
    hasDeposited,
    depositCents,
    setMission1,
  } = useUserGame();

  /* 0. Tant que le bootstrap n’a pas rempli le store → mini-loader */
  if (hasDeposited === undefined) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#160028]/90">
        <p className="text-white animate-pulse">Loading…</p>
      </div>
    );
  }

  /* 1. Collect (POST /mission1/collect) */
  const handleCollect = async () => {
    const token  = window.Telegram?.WebApp?.initData;
    const apiURL = import.meta.env.VITE_BACKEND_URL;
    if (!token) return;

    onCollect?.();                                   // pop-up immédiat
    try {
      const r = await fetch(`${apiURL}/api/mission1/collect`, {
        method : "POST",
        headers: { Authorization: `tma ${token}` },
      });
      if (!r.ok) return;
      const { data } = await r.json();

      /* hydrate le store avec les nouvelles valeurs */
      setMission1({
        unlockedParts: data.unlockedParts,
        claimedParts : data.claimedParts,
      });
    } catch (e) {
      console.error("❌ /mission1/collect :", e);
    }
  };

  /* 2. Rendu */
  return hasDeposited && depositCents !== undefined ? (
    <Mission1AfterDeposit onBack={onBack} onCollect={handleCollect} />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
