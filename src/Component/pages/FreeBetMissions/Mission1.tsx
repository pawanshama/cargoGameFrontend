/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
------------------------------------------------------------------ */
import { useMemo } from "react";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";
import { useUserGame }       from "../../../store/useUserGame";
import useMission1           from "../../../hooks/useMission1";

/*────────── Props ──────────*/
interface Mission1Props {
  onBack   : () => void;
  onCollect?: () => void;
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

  /* --------- Telegram token --------- */
  const token = window.Telegram?.WebApp?.initData || "";

  /* --------- React-Query fetch --------- */
  const { isLoading } = useMission1({
    enabled: !!token,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0,
    /* Hydrate le cache avec les données du store pour éviter un flash */
    initialData: useMemo(() => {
      if (
        mission1 &&
        depositCents !== undefined
      ) {
        return {
          depositCents,
          unlockedParts: mission1.unlockedParts,
          claimedParts : mission1.claimedParts,
        };
      }
      return undefined;
    }, [mission1, depositCents]),
    onSuccess: (d) => {
      setMission1({ unlocked: d.unlockedParts, claimed: d.claimedParts });
      setDepositInfo({ has: d.depositCents > 0, cents: d.depositCents });
    },
  });

  /* --------- rendu --------- */
  const firstLoad =
    (hasDeposited === undefined ||
      depositCents === undefined ||
      mission1 === undefined) && isLoading;

  if (firstLoad) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#160028]/90 z-50">
        <p className="text-white animate-pulse">Loading…</p>
      </div>
    );
  }

  /* rafraîchissement arrière-plan : l’écran reste visible */
  const handleCollect = () => onCollect?.();

  return hasDeposited && depositCents !== undefined ? (
    <Mission1AfterDeposit onBack={onBack} onCollect={handleCollect} />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
