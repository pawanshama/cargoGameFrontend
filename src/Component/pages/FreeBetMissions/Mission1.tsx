/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/Mission1.tsx — patch final
------------------------------------------------------------------ */
import { useMemo, useCallback } from "react";
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
  const {
    hasDeposited,
    depositCents,
    mission1,
    setDepositInfo,
    setMission1,
  } = useUserGame();

  const token = window.Telegram?.WebApp?.initData || "";

  /* le store est complet seulement si depositCents est défini  */
  const storeReady = useMemo(
    () =>
      hasDeposited !== undefined &&
      depositCents !== undefined &&
      mission1 !== undefined,
    [hasDeposited, depositCents, mission1]
  );

  /* React-Query : refetch à chaque montage, spinner uniquement si rien en store */
  const { isLoading } = useMission1({
    enabled: !!token,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0,
    initialData:
      storeReady && depositCents !== undefined
        ? {
            depositCents,
            unlockedParts: mission1!.unlockedParts,
            claimedParts : mission1!.claimedParts,
          }
        : undefined,
    onSuccess: (d) => {
      setMission1({ unlocked: d.unlockedParts, claimed: d.claimedParts });
      setDepositInfo({ has: d.depositCents > 0, cents: d.depositCents });
    },
  });

  /* spinner seulement au tout premier chargement (store vide + query pending) */
  if (!storeReady && isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#160028]/90 z-50">
        <p className="text-white animate-pulse">Loading…</p>
      </div>
    );
  }

  /* collecte (le refetch arrière-plan se charge de mettre à jour la barre) */
  const handleCollect = useCallback(() => onCollect?.(), [onCollect]);

  return hasDeposited && depositCents !== undefined ? (
    <Mission1AfterDeposit onBack={onBack} onCollect={handleCollect} />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
