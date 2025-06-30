/* --------------------------------------------------------------------------
   src/Component/pages/Wallet/Withdraw.tsx
   -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "../context/WalletContext";     // 🆕
import Button from "../common/Button";

/* ---------- props ---------- */
interface WithdrawProps {
  inputValues: Record<string, string>;
  handleInputChange: (
    key: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWithdraw: () => void;               // ouvre le modal Success
}

const MIN_TON = 0.1;                        // 0.1 TON mini

/* -------------------------------------------------------------------------- */

const Withdraw: React.FC<WithdrawProps> = ({
  inputValues,
  handleInputChange,
  handleWithdraw,
}) => {
  /* ---------------- state ---------------- */
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  /* ---------------- global ---------------- */
  const { wallet, refreshWallet } = useWallet();          // 🚀

  /* in-game balance (TON) */
  const numericBal = wallet?.paidcoins ?? 0;
  const balanceStr = numericBal.toFixed(3);

  /* ---------------- helpers ---------------- */
  const setMax = () =>
    handleInputChange("amount")({
      target: { value: balanceStr },
    } as unknown as React.ChangeEvent<HTMLInputElement>);

  const submit = async () => {
    const amount = parseFloat(inputValues.amount);
    if (!amount || amount < MIN_TON) {
      setStatus("error");
      return;
    }

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/wallet/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `tma ${initData}`,
          },
          body: JSON.stringify({ amount: Math.round(amount * 1000) }), // cent-TON
        },
      );
      const { success } = await res.json();

      if (res.ok && success) {
        new Audio("/assets/sounds/23.withdraw.mp3").play().catch(() => {});
        await refreshWallet();      // ✅ MAJ globale du solde
        setStatus("done");
        handleWithdraw();           // ouvre modal succès
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  /* ---------------------------------------------------------------- render */
  return (
    <div className="w-full max-w-[420px] mx-auto text-white font-lato">
      <motion.form
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 12 }}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="backdrop-blur bg-[#1c1530]/60 border border-[#5b2bff]/40 rounded-3xl p-6 shadow-xl shadow-[#5b2bff]/20"
      >
        {/* ---------- balance ---------- */}
        <Field label="In-game balance" value={`${balanceStr} TON`} />

        {/* ---------- amount ---------- */}
        <div className="mt-6">
          <label htmlFor="amount" className="text-sm text-gray-300 mb-1">
            Amount to withdraw
          </label>

          <div className="flex items-center bg-[#29153B]/80 border border-[#5b2bff]/40 rounded-xl px-4 py-2">
            <motion.input
              id="amount"
              type="number"
              min={0}
              step="0.01"
              value={inputValues.amount}
              placeholder={`≥ ${MIN_TON}`}
              onChange={handleInputChange("amount")}
              whileFocus={{ borderColor: "#8C4DFF" }}
              className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none"
            />

            <button
              type="button"
              onClick={setMax}
              className="ml-3 bg-gradient-to-r from-[#5b2bff] via-[#7e3cff] to-[#00e1ff] text-xs font-bold py-1 px-3 rounded-lg ripple"
            >
              Max
            </button>
          </div>
        </div>

        {/* ---------- CTA + feedback ---------- */}
        <div className="flex flex-col items-center mt-7 gap-3">
          <motion.div
            animate={status === "sending" ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ repeat: status === "sending" ? Infinity : 0, duration: 1 }}
          >
            <Button
              label={status === "sending" ? "Processing…" : "Withdraw"}
              handleButtonClick={submit}
              disabled={status === "sending"}
              type="button"
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {status === "sending" && (
              <motion.div
                key="spin"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-cyan-400" />
                Awaiting confirmation…
              </motion.div>
            )}

            {status === "done" && (
              <motion.p
                key="done"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-green-400 font-semibold"
              >
                ✅ Withdraw request sent!
              </motion.p>
            )}

            {status === "error" && (
              <motion.p
                key="err"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-red-400 font-semibold"
              >
                ❌ Something went wrong
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.form>

      {/* ripple util */}
      <style>
        {`
          .ripple{position:relative;overflow:hidden}
          .ripple::after{
            content:"";position:absolute;inset:0;background:#fff;border-radius:inherit;
            opacity:0;transform:scale(0);transition:opacity .6s,transform .4s
          }
          .ripple:active::after{opacity:.15;transform:scale(1);transition:0s}
        `}
      </style>
    </div>
  );
};

/* ---------------- tiny Field ---------------- */
const Field = ({ label, value }: { label: string; value: string }) => (
  <motion.div
    className="mt-4"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.05 }}
  >
    <label className="text-sm text-gray-300 mb-1 block">{label}</label>
    <div className="bg-[#29153B]/70 border border-[#5b2bff]/30 rounded-xl px-4 py-2 text-sm font-bold">
      {value}
    </div>
  </motion.div>
);

export default Withdraw;
