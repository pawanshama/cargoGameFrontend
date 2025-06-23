import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkle, ArrowLeft } from "lucide-react";
import Button from "../../common/Button";

interface Mission1BeforeDepositProps {
  onBack: () => void;
}

const steps = [
  {
    title: "Step 1",
    desc: "Deposit your first amount (e.g., $100).",
  },
  {
    title: "Step 2",
    desc: "Unlock free bets incrementally until your entire deposit is matched.",
  },
] as const;

const Mission1BeforeDeposit: React.FC<Mission1BeforeDepositProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#150024] via-[#1a0730] to-[#30105a]">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#5b2bff]/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-[#00e1ff]/40 blur-3xl" />

      {/* Card */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 14 }}
        className="relative mx-auto mt-20 mb-16 w-[92%] max-w-md rounded-[2rem] p-[2px] shadow-xl shadow-[#000]/40 backdrop-blur-md"
        style={{ background: "linear-gradient(135deg,#5b2bff,#7e3cff 40%,#00e1ff)" }}
      >
        <div className="rounded-[2rem] bg-[#1c1230]/60 p-7 backdrop-blur-xl">
          {/* Header */}
          <header className="flex flex-col items-center gap-3 text-center">
            <Sparkle className="h-11 w-11 text-[#00e1ff] drop-shadow-[0_0_8px_rgba(0,225,255,0.8)]" />
            <h1 className="font-designer text-3xl font-extrabold uppercase tracking-wider text-white/90">
              Mission 1
            </h1>
            <p className="max-w-xs text-[15px] text-white/80">
              Deposit your first amount and receive an equivalent value in free bets.
            </p>
          </header>

          {/* Reward visual */}
          <img
            src="/assets/dollardollar.png"
            alt="Dollar reward"
            className="mx-auto my-6 h-44 w-44 drop-shadow-[0_0_30px_rgba(0,255,178,0.6)]"
          />

          {/* Catchphrase */}
          <p className="text-center font-designer text-2xl font-bold uppercase leading-snug text-white">
            <span className="block">Double the fun,</span>
            <span className="block text-[#00FFB2]">Double the rewards!</span>
          </p>

          {/* CTA */}
          <Button
            label="Make First Deposit"
            type="button"
            handleButtonClick={() => navigate("/wallet")}
            additionalClass="mt-8 w-full rounded-xl bg-gradient-to-r from-[#5b2bff] via-[#7e3cff] to-[#00e1ff] active:scale-95"
          />

          {/* Steps */}
          <div className="mt-10 flex flex-col gap-5">
            {steps.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 + i * 0.05 }}
                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
              >
                <h3 className="mb-1 font-designer text-[15px] font-bold uppercase tracking-wide text-white/90">
                  {title}
                </h3>
                <p className="text-sm text-white/80">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Back link */}
          <button
            className="mt-10 flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#00FFB2] transition active:scale-95"
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
