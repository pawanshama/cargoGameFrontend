import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkle, ArrowLeft } from "lucide-react";
import Button from "../../common/Button";

interface Mission1BeforeDepositProps {
  onBack: () => void;
}

const Mission1BeforeDeposit: React.FC<Mission1BeforeDepositProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#160028] via-[#1d0934] to-[#2b1048] px-4">
      {/* Card wrapper with animated entrance & gradient border */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 12 }}
        className="w-full max-w-md rounded-3xl p-[1px] bg-gradient-to-br from-[#5b2bff] via-[#7e3cff] to-[#00e1ff] shadow-xl"
      >
        {/* Inner glass panel */}
        <div className="rounded-3xl bg-[#1c1230]/60 backdrop-blur-xl p-6">
          {/* Header */}
          <header className="mb-6 flex flex-col items-center gap-2">
            <Sparkle className="h-10 w-10 text-[#00e1ff] drop-shadow-[0_0_6px_rgba(0,225,255,0.8)]" />
            <h1 className="font-designer text-2xl font-extrabold uppercase tracking-wider text-white">
              Mission 1
            </h1>
            <p className="mx-auto max-w-xs text-center text-sm text-white/80">
              Deposit your first amount and get the same value in free bets.
            </p>
          </header>

          {/* Reward visual */}
          <img
            src="/assets/dollardollar.png"
            alt="Dollar reward"
            className="mx-auto mb-4 h-40 w-40 drop-shadow-[0_0_25px_rgba(0,255,178,0.5)]"
          />

          {/* Catchphrase */}
          <p className="text-center font-designer text-xl font-bold uppercase leading-tight text-white">
            <span className="block">Double the fun,</span>
            <span className="block text-[#00FFB2]">Double the rewards!</span>
          </p>

          {/* CTA */}
          <Button
            label="Make First Deposit"
            type="button"
            handleButtonClick={() => navigate("/wallet")}
            additionalClass="mt-6 w-full rounded-xl active:scale-95"
          />

          {/* Steps */}
          <div className="mt-8 flex flex-col gap-4">
            {[
              {
                title: "Step 1",
                desc: "Deposit your first amount. For example, $100.",
              },
              {
                title: "Step 2",
                desc: "Unlock free bets incrementally as you place bets until your full deposit is matched.",
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-md"
              >
                <h3 className="mb-1 font-designer text-base font-bold uppercase tracking-wide text-white">
                  {title}
                </h3>
                <p className="text-sm text-white/80">{desc}</p>
              </div>
            ))}
          </div>

          {/* Back link */}
          <button
            className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-[#00FFB2] transition active:scale-95"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Missions
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Mission1BeforeDeposit;
