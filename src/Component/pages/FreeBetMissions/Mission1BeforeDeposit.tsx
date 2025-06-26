import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkle, ArrowLeft } from "lucide-react";
import Button from "../../common/Button";

interface Mission1BeforeDepositProps {
  onBack: () => void;
  /** facultatif si le parent envoie la prop sans s’en servir */
  onCollect?: () => void;
  /** ces deux champs sont ignorés par le composant mais évitent une erreur TS quand ils sont propagés */
  hasDeposited?: boolean;
  depositAmount?: number;
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

/* ------------------------------------------------------------------ */
/*                         COMPONENT                                  */
/* ------------------------------------------------------------------ */
const Mission1BeforeDeposit: React.FC<Mission1BeforeDepositProps> = ({ onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center overflow-y-auto overflow-x-hidden bg-gradient-to-b from-[#150024] via-[#1a0730] to-[#30105a] pb-24 pt-10 px-4">
      {/* ---------- Decorative blobs ---------- */}
      <div className="pointer-events-none absolute -top-36 -left-32 size-[28rem] rounded-full bg-[#6443ff]/40 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-[-12rem] right-[-10rem] size-[26rem] rounded-full bg-[#00e1ff]/45 blur-[140px]" />

      {/* ---------- Card ---------- */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 85, damping: 14 }}
        className="relative mx-auto w-full max-w-md rounded-[2rem] shadow-xl shadow-black/40"
      >
        {/* gradient border with mask */}
        <div className="absolute inset-0 rounded-[2rem] bg-[conic-gradient(var(--tw-gradient-stops))] from-[#5b2bff] via-[#7e3cff] to-[#00e1ff] p-[2px]" />

        {/* glass panel */}
        <div className="relative rounded-[2rem] bg-[#1c1230]/60 backdrop-blur-xl p-7">
          {/* Header */}
          <header className="flex flex-col items-center gap-3 text-center">
            <Sparkle className="h-12 w-12 text-[#00e1ff] drop-shadow-[0_0_8px_rgba(0,225,255,0.8)]" />
            <h1 className="font-designer text-3xl font-extrabold uppercase tracking-widest text-white">
              Mission 1
            </h1>
            <p className="max-w-xs text-[15px] leading-snug text-white/85">
              Deposit your first amount and receive an equivalent value in free bets.
            </p>
          </header>

          {/* Reward icon */}
          <img
            src="/assets/dollardollar.png"
            alt="Reward bag"
            className="mx-auto my-8 h-40 w-40 drop-shadow-[0_0_30px_rgba(0,255,178,0.55)]"
            loading="eager"
          />

          {/* Catchphrase */}
          <p className="text-center font-designer text-2xl font-bold uppercase leading-snug text-white">
            DOUBLE THE FUN,<br />
            <span className="text-[#00FFB2]">DOUBLE THE REWARDS!</span>
          </p>

          {/* CTA */}
          <Button
            label="Make First Deposit"
            type="button"
            handleButtonClick={() => navigate("/wallet")}
            additionalClass="mt-8 w-full rounded-xl active:scale-95 bg-gradient-to-r from-[#5b2bff] via-[#7e3cff] to-[#00e1ff]"
          />

          {/* Steps */}
          <div className="mt-10 flex flex-col gap-5">
            {steps.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.05 + i * 0.05 }}
                className="rounded-xl bg-[#211438]/80 px-4 py-5 backdrop-blur-md"
              >
                <h3 className="mb-2 font-designer text-sm font-bold uppercase tracking-wide text-white/90">
                  {title}
                </h3>
                <p className="text-[13px] leading-relaxed text-white/80">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Back link */}
          <button
            onClick={onBack}
            className="mt-10 flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#00FFB2] transition active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Missions
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Mission1BeforeDeposit;