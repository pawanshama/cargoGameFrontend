/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx — version “instant + refetch”
------------------------------------------------------------------ */
import { useEffect, useCallback } from "react";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";
import { useUserGame }       from "../../../store/useUserGame";
import useMission1           from "../../../hooks/useMission1";

/*────────── Types backend ──────────*/
interface Mission1StatusPayload {
  unlockedParts: number;
  claimedParts : number;
  depositCents : number;
}

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
  const tg     = window.Telegram?.WebApp;
  const token  = tg?.initData || "";
  const apiURL = import.meta.env.VITE_BACKEND_URL;

  /* =================== helpers API =================== */
  const fetchMissionStatus = useCallback(async () => {
    if (!token) return;
    const r = await fetch(`${apiURL}/api/mission1/status`, {
      headers: { Authorization: `tma ${token}` },
    });
    if (!r.ok) return;
    const { data } = (await r.json()) as { data: Mission1StatusPayload };
    setMission1({ unlocked: data.unlockedParts, claimed: data.claimedParts });
    setDepositInfo({ has: data.depositCents > 0, cents: data.depositCents });
  }, [apiURL, token, setMission1, setDepositInfo]);

  /* --------- collect --------- */
  const handleCollect = () => {
    if (!token) return;
    onCollect?.(); // feedback immédiat
    fetch(`${apiURL}/api/mission1/collect`, {
      method: "POST",
      headers: { Authorization: `tma ${token}` },
    })
      .then(() => fetchMissionStatus())
      .catch((e) => console.error("❌ /mission1/collect :", e));
  };

  /* --------------------------------------------------------------------
     1️⃣  Refetch systématique à chaque montage (hydratation en arrière-plan)
     -------------------------------------------------------------------- */
  useMission1({
    enabled: !!token,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  /* --------------------------------------------------------------------
     2️⃣  Hydrate le store une toute première fois si vide (évite fetch
         inutile quand déjà présent grâce au pre-fetch dans App.tsx)
     -------------------------------------------------------------------- */
  const needInit =
    token &&
    (hasDeposited === undefined ||
      depositCents === undefined ||
      mission1 === undefined);

  useEffect(() => {
    if (!needInit) return;

    (async () => {
      try {
        const r = await fetch(`${apiURL}/api/user/deposit-status`, {
          headers: { Authorization: `tma ${token}` },
        });
        if (r.ok) {
          const j = await r.json();
          setDepositInfo({ has: j.hasDeposited, cents: j.depositAmount });
          if (j.hasDeposited) await fetchMissionStatus();
        }
      } catch (e) {
        console.error("❌ /deposit-status :", e);
      }
    })();
  }, [needInit, apiURL, token, fetchMissionStatus, setDepositInfo]);

  /* --------- rendu --------- */
  const loading =
    hasDeposited === undefined ||
    depositCents === undefined ||
    mission1 === undefined;

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#160028]/90 z-50">
        <p className="text-white animate-pulse">Loading…</p>
      </div>
    );
  }

  return hasDeposited && depositCents !== undefined ? (
    <Mission1AfterDeposit onBack={onBack} onCollect={handleCollect} />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
