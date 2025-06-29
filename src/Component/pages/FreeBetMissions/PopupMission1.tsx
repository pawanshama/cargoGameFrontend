/* ------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/PopupMission1.tsx
   ------------------------------------------------------------------ */
import React, { useMemo } from "react";
import { useNavigate }    from "react-router-dom";
import Button             from "../../common/Button";

interface PopupMission1Props {
  onClose: () => void;
  rewardAmount?: number;             // ex : 20
}

const PopupMission1 = ({ onClose, rewardAmount = 20 }: PopupMission1Props) => {
  const navigate = useNavigate();

  /* 🔊 SFX */
  const playClick = () =>
    new Audio("/sounds/click.mp3").play().catch(() => {});

  /* 💰 Pièces : calculées UNE fois — plus de régénération */
  const coins = useMemo(
    () =>
      [...Array(30)].map((_, i) => {
        const size     = 20 + Math.random() * 20;
        const left     = Math.random() * 100;
        const delay    = Math.random() * 1.5;
        const duration = 2 + Math.random() * 1.5;

        return (
          <img
            key={`coin-${i}`}
            src="/assets/coin.png"
            alt="coin"
            className="animate-fall"
            style={{
              top: "-50px",
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      }),
    [],
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#160028]/90 flex items-center justify-center">
      {/* coins */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {coins}
      </div>

      {/* popup */}
      <div className="bg-[#2b1048] p-6 rounded-2xl border border-[#9752b9] text-center w-[90%] max-w-sm relative z-10 shadow-2xl animate-pulse-zoom">
        <img
          src="/assets/Gifticonfreebet.png"
          alt="Gift Box"
          className="w-[100px] sm:w-[120px] mx-auto mb-6"
        />

        <p className="text-[18px] sm:text-[20px] font-bold font-designer text-white uppercase mb-2">
          MISSION 1 COMPLETED!
        </p>
        <p className="text-[16px] font-lato text-white/80 mb-2">
          You made your first deposit and unlocked a reward!
        </p>
        <p className="text-[22px] sm:text-[26px] font-bold font-designer text-[#00FFB2] uppercase mb-6">
          ${rewardAmount} FREE BETS!
        </p>

        <div className="flex justify-center">
          <Button
            label="START PLAYING"
            type="button"
            handleButtonClick={() => {
              playClick();
              onClose();
              navigate("/bet");
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* Empêche tout nouveau rendu tant que onClose & rewardAmount ne changent pas */
export default React.memo(PopupMission1);