import React from "react";
import Button from "../../common/Button";
import { useNavigate } from "react-router-dom";

interface PopupMission1Props {
  onClose: () => void;
}

const PopupMission1: React.FC<PopupMission1Props> = ({ onClose }) => {
  const navigate = useNavigate();

  const playClickSound = () => {
    const audio = new Audio("/sounds/click.mp3");
    audio.play();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#160028]/90 flex items-center justify-center">
      {/* ANIMATION DES PIÈCES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(30)].map((_, index) => {
          const size = 20 + Math.random() * 20;
          const left = Math.random() * 100;
          const delay = Math.random() * 1.5;
          const duration = 2 + Math.random() * 1.5;

          return (
            <img
              key={`coin-m1-${index}`}
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
                position: "absolute",
              }}
            />
          );
        })}
      </div>

      {/* POPUP CONTENU */}
      <div className="bg-[#2b1048] p-6 rounded-xl border border-[#9752b9] text-center w-[90%] max-w-sm relative z-10">
        <img src="/assets/Gifticonfreebet.png" alt="Gift Box" className="w-[120px] mx-auto mb-6" />
        <p className="text-[18px] sm:text-[20px] font-bold font-designer text-white uppercase leading-tight mb-2">
          CONGRATULATIONS! YOU WON
        </p>
        <p className="text-[22px] sm:text-[24px] font-bold font-designer text-[#00FFB2] uppercase mb-6">
          $20 FREE BETS!
        </p>
        <div className="flex justify-center">
          <Button
            label="START PLAYING"
            type="button"
            handleButtonClick={() => {
              playClickSound();
              onClose();
              navigate("/bet");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PopupMission1;
