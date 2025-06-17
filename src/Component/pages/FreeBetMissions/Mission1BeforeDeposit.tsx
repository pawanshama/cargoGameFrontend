import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../common/Button";

interface Mission1BeforeDepositProps {
  onBack: () => void;
}

const Mission1BeforeDeposit: React.FC<Mission1BeforeDepositProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-50 bg-[#160028] bg-opacity-95 overflow-y-auto">
      <div className="px-4 pt-[40px] pb-40 h-screen text-center overflow-y-auto">
        <p className="text-[28px] font-bold font-designer text-white uppercase mb-2">
          MISSION 1: DOUBLE YOUR FIRST DEPOSIT!
        </p>
        <p className="text-sm text-white opacity-80">
          Deposit your first amount and get the same amount in free bets! Achieve milestones to unlock your rewards.
        </p>
        <img
          src="/assets/dollardollar.png"
          alt="Dollar reward"
          className="w-[210px] h-[210px] mx-auto mt-2 mb-3"
        />
        <p className="text-[17px] font-bold text-white font-designer uppercase">
          <span className="text-white">DOUBLE THE FUN,</span>
          <br />
          <span className="text-[#00FFB2]">DOUBLE THE REWARDS!</span>
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            label="MAKE FIRST DEPOSIT"
            type="button"
            handleButtonClick={() => navigate("/wallet")}
          />
        </div>
        <div className="mt-10 px-4">
          <div className="border border-[#9752b9] rounded-xl p-4 mb-4">
            <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">STEP 1</h3>
            <p className="text-sm text-white opacity-80">
              Deposit your first amount. For example, deposit $100.
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

export default Mission1BeforeDeposit;
