/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
   ------------------------------------------------------------------ */

import { useEffect, useState, useCallback } from "react";

import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";
import { useUserGame }       from "../../../store/useUserGame";

/*────────── Types ──────────*/
interface Mission1StatusPayload {
  unlockedParts: number;
  claimedParts : number;
  depositCents : number;
}

interface Mission1Props {
  onBack   : () => void;
  onCollect?: () => void; // pop-up succès
}

/*───────────────────────────────────────────────────────────*/
const Mission1: React.FC<Mission1Props> = ({ onBack, onCollect }) => {
  /* --------- store global --------- */
  const {
    hasDeposited,
    depositCents,
    setDepositInfo,
    setMission1,
  } = useUserGame();

  /* --------- loader local --------- */
  const [loading, setLoading] = useState(true);

  /* --------- helpers --------- */
  const tg     = window.Telegram?.WebApp;
  const token  = tg?.initData || "";
  const apiURL = import.meta.env.VITE_BACKEND_URL;

  /* =================== helpers API =================== */
  const fetchMissionStatus = useCallback(async () => {
    if (!token) return;
    try {
      const r = await fetch(`${apiURL}/api/mission1/status`, {
        headers: { Authorization: `tma ${token}` },
      });
      if (!r.ok) return;

      const { data } = await r.json();
      const d = data as Mission1StatusPayload;

      // garde le store pour d’autres écrans
      setMission1({ unlocked: d.unlockedParts, claimed: d.claimedParts });

      if (d.depositCents && depositCents === undefined) {
        setDepositInfo({ has: true, cents: d.depositCents });
      }
    } catch {
      /* silencieux */
    }
  }, [apiURL, token, depositCents, setMission1, setDepositInfo]);

  /* --------- collect --------- */
  const handleCollect = () => {
    if (!token) return;
    onCollect?.(); // pop-up immédiat

    fetch(`${apiURL}/api/mission1/collect`, {
      method: "POST",
      headers: { Authorization: `tma ${token}` },
    })
      .then(() => fetchMissionStatus())
      .catch((e) => console.error("❌ /mission1/collect :", e));
  };

  /* ============ effet : dépôt + spinner ============ */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        // 1️⃣  Toujours récupérer le statut dépôt
        const r = await fetch(`${apiURL}/api/user/deposit-status`, {
          headers: { Authorization: `tma ${token}` },
        });
        if (r.ok) {
          const j = await r.json();
          setDepositInfo({ has: j.hasDeposited, cents: j.depositAmount });

          // 2️⃣  Si dépôt → récupérer l’état de la mission
          if (j.hasDeposited) await fetchMissionStatus();
        }
      } catch (e) {
        console.error("❌ /user/deposit-status :", e);
      } finally {
        setLoading(false); // ✅  Fin unique
      }
    };

    load();
  }, [apiURL, token, fetchMissionStatus, setDepositInfo]);

  /* =================== rendu =================== */
  if (loading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#160028]/90">
        <p className="animate-pulse text-white">Loading…</p>
      </div>
    );
  }

  return hasDeposited ? (
    <Mission1AfterDeposit onBack={onBack} onCollect={handleCollect} />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
