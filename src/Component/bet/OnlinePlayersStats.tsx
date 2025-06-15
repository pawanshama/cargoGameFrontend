import { InviteIcon } from "../../assets/iconset";
import FreeBetIconActive from "../../assets/images/freeBetActive.png";
import useTelegramSafeSound from "../../hooks/useTelegramSafeSound";

interface OnlinePlayersStatsProps {
  isStatisticsShow: boolean;
  setIsStatisticsShow: (value: boolean) => void;
}

const OnlinePlayersStats: React.FC<OnlinePlayersStatsProps> = ({
  isStatisticsShow,
  setIsStatisticsShow
}) => {
  // ✅ Préparation des sons
  const playStatsSound = useTelegramSafeSound("/assets/sounds/16Statsbutton.mp3");
  const playLuckyBetSound = useTelegramSafeSound("/assets/sounds/3LuckyBet.mp3");

  return (
    <div className="flex flex-col gap-4">
      {/* Bloc Stats */}
      <div className="rounded-lg border border-secondary bg-alternateBackground flex flex-col gap-[.625rem] p-3">
        <div className="flex items-center gap-1">
          <InviteIcon color="#fff" />
          <div>
            <p className="textBold text-white">35.5k</p>
            <p className="textSmall text-white max-[380px]:text-[0.55rem]">ONLINE PLAYER</p>
          </div>
        </div>

        <button
          type="button"
          className="py-2 px-3 font-designer text-xs text-center text-white w-full rounded-lg border border-secondary bg-alternateBackground transition-transform duration-100 active:scale-95"
          onClick={() => {
            playStatsSound();
            setIsStatisticsShow(!isStatisticsShow);
          }}
        >
          Stats
        </button>
      </div>

      {/* Lucky Bet */}
      <div className="relative">
        <button
          type="button"
          className="relative bg-buttonSecondary rounded-lg shadow-[0px_0px_14px_0px_#CAE010] py-4 px-3 w-full buttonFont text-center text-white transition-transform duration-100 active:scale-95"
          onClick={() => {
            playLuckyBetSound();
            // Tu peux ajouter ici une logique Lucky Bet supplémentaire
          }}
        >
          {/* Image intégrée dans le bouton pour réagir au clic */}
          <img
            src={FreeBetIconActive}
            alt="gift-icon"
            loading="lazy"
            className="absolute -top-4 -left-3 -rotate-45 drop-shadow-[0px_4px_8px_0px_rgba(0,0,0,0.55)]"
          />
          Lucky bet
        </button>
      </div>
    </div>
  );
};

export default OnlinePlayersStats;
