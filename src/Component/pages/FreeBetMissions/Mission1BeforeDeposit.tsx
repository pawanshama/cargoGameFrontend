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
    desc: "Deposit your first amount (e.g. $100).",
  },
  {
    title: "Step 2",
    desc: "Unlock free bets incrementally until your full deposit is matched.",
  },
] as const;

const Mission1BeforeDeposit: React.FC<Mission1BeforeDepositProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    /* ----------- Root: full-screen flex, smooth scroll ----------- */
    <div className="fixed inset-0 z-50 flex flex-col items-center overflow-auto bg-gradient-to-b from-[#150024] via-[#1a0730] to-[#30105a]">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-[30rem] w-[30rem] rounded-full bg-[#6443ff]/40 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-10rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-[#00e1ff]/40 blur-[120px]" />

      {/* ----------- Card ----------- */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
        className="relative my-24 w-[92%] max-w-md snap-center rounded-[2rem] p-[2px] shadow-xl shadow-black/40"
        style={{
          background:
            "linear-gradient(135deg,#5b2bff 0%,#7e3cff 45%,#00e1ff 100%)",
        }}
      >
        {/* Glass inner panel */}
        <div className="rounded-[2rem] bg-[#1c1230]/60 p-8 backdrop-blur-xl">
          {/* -------- Header -------- */}
          <header className="flex flex-col items-center gap-3 text-center">
            <Sparkle className="h-12 w-12 text-[#00e1ff] drop-shadow-[0_0_8px_rgba(0,225,255,0.8)]" />
            <h1 className="font-designer text-3xl font-extrabold uppercase tracking-widest text-white">
              Mission 1
            </h1>
            <p className="max-w-xs text-sm text-white/80">
              Deposit your first amount and receive the same value in free bets.
            </p>
          </header>

          {/* -------- Reward visual -------- */}
          <img
            src="/assets/dollardollar.png"
            alt="Dollar reward"
            className="mx-auto my-8 h-44 w-44 drop-shadow-[0_0_35px_rgba(0,255,178,0.6)]"
            loading="eager"
          />

          {/* -------- Catchphrase -------- */}
          <p className="text-center font-designer text-2xl font-bold uppercase leading-snug text-white">
            <span>Double the fun,</span>
            <br />
            <span className="text-[#00FFB2]">Double the rewards!</span>
          </p>

          {/* -------- CTA -------- */}
          <Button
            label="Make First Deposit"
            type="button"
            handleButtonClick={() => navigate("/wallet")}
            additionalClass="mt-8 w-full rounded-xl active:scale-95 bg-gradient-to-r from-[#5b2bff] via-[#7e3cff] to-[#00e1ff]"
          />

          {/* -------- Steps -------- */}
          <div className="mt-10 flex flex-col gap-6">
            {steps.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ y: 18, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
              >
                <h3 className="mb-1 font-designer text-sm font-bold uppercase tracking-wide text-white/90">
                  {title}
                </h3>
                <p className="text-sm text-white/80">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* -------- Back link -------- */}
          <button
            onClick={onBack}
            className="mt-12 flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#00FFB2] transition active:scale-95"
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
