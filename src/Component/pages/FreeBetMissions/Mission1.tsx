/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
   ------------------------------------------------------------------ */

import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";
import { useUserGame }       from "../../../store/useUserGame";

/*────────── Props ──────────*/
interface Mission1Props {
  onBack   : () => void;
  onCollect?: () => void;           // pop-up succès
}

/*───────────────────────────────────────────────────────────*/
const Mission1: React.FC<Mission1Props> = ({ onBack, onCollect }) => {
  /* --------- store global --------- */
  const {
    hasDeposited,
    depositCents,
    setMission1,                       // pour mise à jour après collect
  } = useUserGame();

  /* --------- collect (seul appel réseau restant) --------- */
  const tg     = window.Telegram?.WebApp;
  const token  = tg?.initData || "";
  const apiURL = import.meta.env.VITE_BACKEND_URL;

  const handleCollect = async () => {
    if (!token) return;
    onCollect?.();                     // ouvre le pop-up tout de suite

    try {
      const r = await fetch(`${apiURL}/api/mission1/collect`, {
        method : "POST",
        headers: { Authorization: `tma ${token}` },
      });
      if (!r.ok) return;

      /* Le backend renvoie l’état mis à jour de la mission */
      const { data } = await r.json();
      setMission1({
        unlocked: data.unlockedParts,
        claimed : data.claimedParts,
      });
    } catch (e) {
      console.error("❌ /mission1/collect :", e);
    }
  };

  /* --------- rendu --------- */
  return hasDeposited && depositCents !== undefined ? (
    <Mission1AfterDeposit onBack={onBack} onCollect={handleCollect} />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
