/* src/Component/pages/Wallet/Withdraw.tsx
   – Glass / Neon + Framer-motion                                           */

import { useEffect, useState } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";

interface WithdrawProps {
  inputValues: Record<string, string>;
  handleInputChange: (
    key: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWithdraw: () => void;
  refreshWallet: () => void;
}

const MIN_TON = 0.1;

const Withdraw: React.FC<WithdrawProps> = ({
  inputValues,
  handleInputChange,
  handleWithdraw,
  refreshWallet,
}) => {
  const [status,  setStatus]  = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [balance, setBal]     = useState("0.000");
  const wallet                = useTonWallet();

  /* ---------- fetch balance ---------- */
  useEffect(() => {
    const fetchBal = async () => {
      if (!wallet?.account?.address) return;
      try {
        const r = await fetch(
          `https://toncenter.com/api/v2/getAddressBalance?address=${wallet.account.address}`,
        );
        const { result } = await r.json();
        setBal((Number(result) / 1e9).toFixed(3));
      } catch {
        setBal("N/A");
      }
    };
    fetchBal();
  }, [wallet]);

  /* ---------- helpers ---------- */
  const setMax = () =>
    handleInputChange("amount")({
      target: { value: balance },
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
          method : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization : `tma ${initData}`,
          },
          body: JSON.stringify({ amount: Math.round(amount * 100) }),
        },
      );
      const data = await res.json();

      if (res.ok && data.success) {
        new Audio("/assets/sounds/23.withdraw.mp3").play().catch(() => {});
        setStatus("done");
        refreshWallet();
        handleWithdraw();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  /* ---------- UI ---------- */
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-[420px] mx-auto p-5 text-white"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {/* balance */}
      <div className="w-full space-y-6 mb-[clamp(1rem,7vw,2.625rem)]">
        <Field label="TON Available Balance" value={`${balance} TON`} />

        {/* amount */}
        <div>
          <label htmlFor="amount" className="text-sm text-gray-300 mb-1">
            Amount to withdraw
          </label>
          <div className="flex items-center bg-[#29153B]/80 border border-[#8646A4]/40 rounded-xl px-4 py-2">
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
              className="ml-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-xs font-bold py-1 px-3 rounded-lg ripple"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      {/* CTA + feedback */}
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={
            status === "sending"
              ? { scale: [1, 1.08, 1] }
              : { scale: 1 }
          }
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
    </motion.form>
  );
};

/* ---------- tiny Field --------- */
const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <label className="text-sm text-gray-300 mb-1 block">{label}</label>
    <div className="bg-[#29153B]/70 border border-[#8646A4]/40 rounded-xl px-4 py-2 text-sm font-bold">
      {value}
    </div>
  </div>
);

export default Withdraw;
