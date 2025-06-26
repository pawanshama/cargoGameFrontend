import React from "react";
import Button from "../../common/Button";
import { formatFreeBet } from "../../../utils/format-freebet";

interface Mission1AfterDepositProps {
  onBack: () => void;
  onCollect: () => void;
  depositAmount: number; // 💰 montant du dépôt passé en prop
}

const playCollectSound = () => {
  const audio = new Audio("/assets/sounds/10.Moneyadded.mp3");
  audio.play().catch((err) => console.error("❌ Audio error:", err));
};

const Mission1AfterDeposit: React.FC<Mission1AfterDepositProps> = ({
  onBack,
  onCollect,
  depositAmount,
}) => {
  return (
    <div className="relative z-50 bg-[#160028] bg-opacity-95 overflow-y-auto min-h-screen">
      <div className="px-4 pt-10 pb-8 h-auto text-center">
        {/* Mission Title */}
        <p className="text-[28px] font-bold font-designer text-white uppercase mb-2">
          MISSION 1: DOUBLE YOUR FIRST DEPOSIT!
        </p>

        <p className="text-sm text-white opacity-80 mb-8">
          Deposit your first amount and get the same amount in free bets! Achieve milestones to unlock your rewards.
        </p>

        {/* Collect Free Bets Section */}
        <div className="flex justify-center mt-10">
          <div
            onClick={onCollect}
            className="w-full max-w-[80%] lg:max-w-[60%] rounded-2xl border-2 border-[#00FFB2] p-4 bg-[#1f0238] shadow-[0_0_15px_#00FFB2] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform duration-100"
          >
            <img
              src="/assets/Gifticonfreebet.png"
              alt="Gift"
              className="w-[30px] h-[30px] object-contain"
            />
            <p className="text-[#00FFB2] text-[16px] sm:text-[18px] font-bold font-designer whitespace-nowrap text-center">
              COLLECT {(depositAmount / 100).toFixed(2)} <span className="text-white">Free Bets</span>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full max-w-[90%] mt-10 mx-auto">
          <div className="bg-[#3c1a57] rounded-full h-6 flex items-center px-1 relative z-10">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-4 mx-1 rounded-full ${
                  i === 0 ? "bg-[#00FFB2]" : "bg-[#5e2d82]"
                }`}
              ></div>
            ))}
          </div>

          <div className="absolute bottom-[-12px] left-0 w-full h-4 flex justify-between z-20 px-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-[20%] flex justify-center">
                <div className="w-[1px] h-[14px] bg-[#00FFB2] opacity-50" />
              </div>
            ))}
          </div>
        </div>

        {/* Free Bet Information */}
        <div className="w-full max-w-[90%] flex justify-between -mt-2 text-xs text-white font-lato z-30 relative">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center leading-tight text-center w-[20%]">
              <span className="text-[11px] text-white mb-[2px]">Bet</span>
              <span className="text-[14px] font-bold">${formatFreeBet(depositAmount / 500)}</span>
              <span className="text-[#00FFB2] mt-[4px] text-[11px]">Get {formatFreeBet(depositAmount / 500)} Free Bet</span>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button
            label="Collect"
            type="button"
            handleButtonClick={() => {
              playCollectSound(); // 👈 plays sound
              onCollect();        // 👈 continue the action
            }}
          />
        </div>

        {/* Instructions */}
        <p className="font-bold text-white text-lg underline font-designer uppercase text-center mt-10 mb-6">
          How can I access my freebets?
        </p>

        <div className="mt-10 px-4">
          <div className="border border-[#9752b9] rounded-xl p-4 mb-4">
            <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">STEP 1</h3>
            <p className="text-sm text-white opacity-80">
              Deposit your first amount. For example, deposit ${depositAmount.toFixed(0)}.
            </p>
          </div>

          <div className="border border-[#9752b9] rounded-xl p-4">
            <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">STEP 2</h3>
            <p className="text-sm text-white opacity-80">
              Unlock free bets step by step as you place bets, until the full value of your deposit is matched.
            </p>
          </div>
        </div>

        <button
          className="mt-6 text-[#00FFB2] underline font-bold transition active:scale-95"
          onClick={onBack}
        >
          ← Back to Missions
        </button>
      </div>
    </div>
  );
};

export default Mission1AfterDeposit;
