import { useEffect, useRef } from "react";
import { CloseIcon } from "../../assets/iconset";
import AlternateButton from "../common/AlternateButton";
import DepositWithdrawCard from "../statistics/DepositWithdrawCard";
import HistoryCard from "../statistics/HistoryCard";
import PlayersCard from "../statistics/PlayersCard";
import PoolsCard from "../statistics/PoolsCard";
import StatisticsCard from "../statistics/StatisticsCard";

interface StatisticsProps {
  isStatisticsShow: boolean;
  setIsStatisticsShow: (value: boolean) => void;
}

const Statistics: React.FC<StatisticsProps> = ({
  isStatisticsShow,
  setIsStatisticsShow,
}) => {
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Création de l'instance Audio seulement une fois
    clickAudioRef.current = new Audio("/assets/sounds/19Backbutton.mp3");
    clickAudioRef.current.preload = "auto";
  }, []);

  const handleClose = () => {
    // Joue le son seulement si l’élément est chargé
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0; // Revenir au début à chaque clic
      clickAudioRef.current.play().catch((e) => {
        console.warn("Erreur de lecture du son :", e);
      });
    }

    setIsStatisticsShow(!isStatisticsShow);
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-10 rounded-t-[.625rem] shadow-[0px_0px_100px_0px_rgba(0,0,0,.05)] flex flex-col backdrop-blur-[1.5625rem] bg-transparent bg-gradient-to-b from-[rgba(62,14,54,0.90)] to-[rgba(35,11,69,0.90)] h-[100dvh] w-full max-w-[640px]">
      {/* Bouton de fermeture avec effet clic */}
      <div className="px-2 py-1 text-right">
        <button
          type="button"
          onClick={handleClose}
          className="h-[1.875rem] w-[1.875rem] bg-transparent active:scale-90 transition-transform duration-100 ease-in-out"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 w-full pt-2 px-5 overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 5rem)', paddingBottom: '7rem' }}>
        <div className="flex flex-col justify-center gap-6 w-full">
          <h2 className="h1 text-white text-center">Statistics</h2>
          <PlayersCard />
          <StatisticsCard />
          <HistoryCard />
          <PoolsCard />
          <DepositWithdrawCard />
          <div className="flex items-center justify-center">
            <AlternateButton handleButtonClick={handleClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
