/* --------------------------------------------------------------------------
   src/Component/pages/Wallet/Deposit.tsx
   -------------------------------------------------------------------------- */

import { useEffect, useRef, useState } from "react";
import { useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { motion, AnimatePresence } from "framer-motion";

import Button                     from "../common/Button";
import { useWallet }              from "../context/WalletContext";
import { useUserGame }            from "../../store/useUserGame";
import useInvalidateMission1      from "../../hooks/useInvalidateMission1";

/* ------------------------------------------------------------------ const */

const DEPOSIT_ADDRESS = "UQCcgQqpCCWy3YEzLLqRRQowXf5-YUC8nbPYP--WQm3dI8E8";

/* ------------------------------------------------------------------ comp  */

const Deposit: React.FC = () => {
  /* Ton / UI state */
  const wallet  = useTonWallet();
  const [tonUI] = useTonConnectUI();

  const [amount, setAmt] = useState("");
  const [bal,    setBal] = useState<string | null>(null);
  const [state,  setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const sentRef   = useRef(false);
  const connected = !!wallet?.account?.address;
  const rawAddr   = wallet?.account?.address;
  const friendly  = rawAddr
    ? Address.parse(rawAddr).toString({ bounceable: false, testOnly: false })
    : "";

  /* WalletContext : rafraîchit le solde */
  const { refreshWallet } = useWallet();

  /* Store global & invalidation */
  const { setDepositInfo }   = useUserGame();
  const invalidateMission1   = useInvalidateMission1();

  /* ---------------- push wallet once ------------------- */
  useEffect(() => {
    if (!connected || sentRef.current) return;
    sentRef.current = true;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/connect`, {
      method : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization : `tma ${window.Telegram?.WebApp?.initData}`,
      },
      body: JSON.stringify({ walletAddress: friendly }),
    }).catch(console.error);
  }, [connected, friendly]);

  /* ---------------- balance on-chain -------------------- */
  useEffect(() => {
    if (!connected) return;
    const id = setTimeout(async () => {
      try {
        const r = await fetch(
          `https://toncenter.com/api/v2/getAddressBalance?address=${rawAddr}`,
        );
        const { result } = await r.json();
        setBal((Number(result) / 1e9).toFixed(3));
      } catch {
        setBal("N/A");
      }
    }, 300);
    return () => clearTimeout(id);
  }, [connected, rawAddr]);

  /* ---------------- send deposit ----------------------- */
  const sendDeposit = async () => {
    const ton = parseFloat(amount);
    if (!ton || ton <= 0) return alert("Enter a valid amount");

    try {
      setState("sending");
      await tonUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages : [{ address: DEPOSIT_ADDRESS, amount: (ton * 1e9).toFixed(0) }],
      });

      new Audio("/assets/sounds/10.Moneyadded.mp3").play().catch(() => {});
      /* ⏳ laisse le temps à la tx d’être indexée, puis rafraîchit le solde */
      setTimeout(async () => {
        await refreshWallet();                          // ✅ WalletContext

        // 1️⃣ alimente le store avec le dépôt
        setDepositInfo({ has: true, cents: Math.round(ton * 1000) });

        // 2️⃣ force le refetch /mission1/status
        invalidateMission1();

        setState("done");
        setAmt("");
      }, 3_000);
    } catch {
      setState("error");
    }
  };

  /* ---------------------------------------------------------------- render */
  return (
    <div className="w-full max-w-[420px] mx-auto text-white font-lato">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 70, damping: 12 }}
        className="backdrop-blur bg-[#1c1530]/60 border border-[#5b2bff]/40 rounded-3xl p-6 shadow-xl shadow-[#5b2bff]/20"
      >
        {connected ? (
          <>
            {/* banner */}
            <div className="flex items-center gap-3 mb-6">
              <img src="/assets/ton-logo.svg" alt="TON" className="w-5 h-5" />
              <p className="text-[15px]">Wallet connected</p>
            </div>

            <Info label="Address"  value={friendly} mono />
            <Info label="Balance"  value={bal ? `${bal} TON` : "…"} />

            {/* amount */}
            <div className="mt-6">
              <label htmlFor="amt" className="text-sm text-gray-300 mb-1">
                Amount&nbsp;(TON)
              </label>
              <motion.input
                id="amt"
                type="number"
                min={0}
                step="0.01"
                value={amount}
                onChange={(e) => setAmt(e.target.value)}
                placeholder="0.00"
                whileFocus={{ borderColor: "#8C4DFF" }}
                className="w-full bg-[#29153B]/80 border border-[#5b2bff]/40 rounded-xl px-4 py-2 text-sm placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* CTA & status */}
            <div className="flex flex-col items-center mt-7 gap-3">
              <motion.div
                animate={state === "sending" ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ repeat: state === "sending" ? Infinity : 0, duration: 1 }}
              >
                <Button
                  label={state === "sending" ? "Sending…" : "Deposit"}
                  handleButtonClick={sendDeposit}
                  disabled={state === "sending"}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {state === "sending" && (
                  <motion.div
                    key="spin"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-cyan-400" />
                    Waiting for confirmation…
                  </motion.div>
                )}

                {state === "done" && (
                  <motion.p
                    key="done"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-green-400 font-semibold"
                  >
                    ✅ Deposit processed!
                  </motion.p>
                )}

                {state === "error" && (
                  <motion.p
                    key="err"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-400 font-semibold"
                  >
                    ❌ Transaction cancelled
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <EmptyState open={() => tonUI.openModal()} />
        )}
      </motion.div>
    </div>
  );
};

/* ---------------- helpers ---------------- */

const Info = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <motion.div
    className="mt-4"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.05 }}
  >
    <p className="text-sm text-gray-300 mb-1">{label}</p>
    <div
      className={`bg-[#29153B]/70 border border-[#5b2bff]/30 rounded-xl px-4 py-2 ${
        mono ? "font-mono text-xs break-all" : "font-semibold"
      }`}
    >
      {value}
    </div>
  </motion.div>
);

const EmptyState = ({ open }: { open: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center gap-5"
  >
    <img src="/assets/empty-wallet.svg" alt="" className="w-20 h-20 opacity-80" />
    <p className="text-[15px] text-center opacity-80">
      You need to connect a wallet to deposit TON.
    </p>
    <button
      onClick={open}
      className="bg-gradient-to-r from-[#5b2bff] via-[#7e3cff] to-[#00e1ff] py-2 px-8 rounded-xl font-bold hover:opacity-90 transition-all"
    >
      🔗 Connect wallet
    </button>
  </motion.div>
);

export default Deposit;
