/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
------------------------------------------------------------------ */
import { useEffect, useState } from "react";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";
import { useUserGame }       from "../../../store/useUserGame";

/*────────── Props ──────────*/
interface Mission1Props {
  onBack   : () => void;
  onCollect?: () => void;   // pop-up succès
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

  /* --------- helpers --------- */
  const token  = window.Telegram?.WebApp?.initData || "";
  const apiURL = import.meta.env.VITE_BACKEND_URL;

  /* --------- état de chargement initial --------- */
  const [loading, setLoading] = useState(
    hasDeposited === undefined ||
    depositCents === undefined ||
    mission1 === undefined
  );

  /* ================= CHARGE LES DONNÉES UNE SEULE FOIS ================= */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        /* 1️⃣  Statut dépôt + montant */
        if (hasDeposited === undefined || depositCents === undefined) {
          const r = await fetch(`${apiURL}/api/user/deposit-status`, {
            headers: { Authorization: `tma ${token}` },
          });
          if (r.ok) {
            const j = await r.json();
            setDepositInfo({ has: j.hasDeposited, cents: j.depositAmount });
          }
        }

        /* 2️⃣  Avancement Mission 1 */
        if (mission1 === undefined) {
          const r = await fetch(`${apiURL}/api/mission1/status`, {
            headers: { Authorization: `tma ${token}` },
          });
          if (r.ok) {
            const { data } = await r.json();
            setMission1({
              unlocked: data.unlockedParts,
              claimed : data.claimedParts,
            });
            setDepositInfo({
              has  : data.depositCents > 0,
              cents: data.depositCents,
            });
          }
        }
      } catch (e) {
        console.error("❌ Mission 1 init :", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← exécute UNE seule fois au montage

  /* --------- collecte : refetch silencieux après succès --------- */
  const handleCollect = () => {
    if (!token) return;
    onCollect?.();

    fetch(`${apiURL}/api/mission1/collect`, {
      method: "POST",
      headers: { Authorization: `tma ${token}` },
    })
      .then(() =>
        fetch(`${apiURL}/api/mission1/status`, {
          headers: { Authorization: `tma ${token}` },
        })
          .then((r) => r.ok && r.json())
          .then((j) => {
            if (!j) return;
            setMission1({
              unlocked: j.data.unlockedParts,
              claimed : j.data.claimedParts,
            });
          })
      )
      .catch((e) => console.error("❌ /mission1/collect :", e));
  };

  /* --------- rendu --------- */
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#160028]/90 z-50">
        <p className="text-white animate-pulse">Loading…</p>
      </div>
    );
  }

  const hasDepositToShow = hasDeposited && depositCents !== undefined && depositCents > 0;

  return hasDepositToShow ? (
    <Mission1AfterDeposit onBack={onBack} onCollect={handleCollect} />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
