/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx
------------------------------------------------------------------ */
import { useCallback } from "react";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit  from "./Mission1AfterDeposit";
import { useUserGame }       from "../../../store/useUserGame";
import useMission1           from "../../../hooks/useMission1";

/*────────── Props ──────────*/
interface Mission1Props {
  onBack   : () => void;
  onCollect?: () => void;
}

const Mission1: React.FC<Mission1Props> = ({ onBack, onCollect }) => {
  /* --------- store Zustand --------- */
  const {
    hasDeposited,
    depositCents,
    mission1,
    setDepositInfo,
    setMission1,
  } = useUserGame();

  /* --------- Telegram token --------- */
  const token = window.Telegram?.WebApp?.initData || "";

  /* --------- Refetch silencieux à chaque ouverture --------- */
  useMission1({
    enabled: !!token,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0,
    initialData:
      depositCents !== undefined && mission1
        ? {
            depositCents,
            unlockedParts: mission1.unlockedParts,
            claimedParts : mission1.claimedParts,
          }
        : undefined,
    onSuccess: (d) => {
      setMission1({ unlocked: d.unlockedParts, claimed: d.claimedParts });
      setDepositInfo({ has: d.depositCents > 0, cents: d.depositCents });
    },
  });

  /* --------- collecte : refetch arrière-plan mettra à jour la barre --------- */
  const handleCollect = useCallback(() => onCollect?.(), [onCollect]);

  /* --------- logiques d’affichage --------- */
  const showAfter =
    (hasDeposited && depositCents !== undefined && depositCents > 0) ||
    (mission1 &&
      (mission1.unlockedParts > 0 || mission1.claimedParts > 0));

  return showAfter ? (
    <Mission1AfterDeposit onBack={onBack} onCollect={handleCollect} />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
