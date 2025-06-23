/*  src/Component/pages/Wallet/Deposit.tsx
    — version sans warning TS6133                                 */

import { useEffect, useRef, useState } from "react";
import { useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import Button from "../common/Button";

interface DepositProps {
  refreshWallet: () => void;
}

const DEPOSIT_ADDRESS =
  "UQCcgQqpCCWy3YEzLLqRRQowXf5-YUC8nbPYP--WQm3dI8E8";

const Deposit: React.FC<DepositProps> = ({ refreshWallet }) => {
  /* TonConnect */
  const wallet               = useTonWallet();
  const [tonConnectUI]       = useTonConnectUI();

  /* UI state */
  const [amount, setAmount]  = useState("");
  const [balance, setBal]    = useState<string | null>(null);
  const [status,  setStatus] = useState("");

  const hasSentWallet = useRef(false);

  const isConnected = !!wallet?.account?.address;
  const rawAddr     = wallet?.account?.address;
  const shortAddr   = rawAddr
    ? Address.parse(rawAddr).toString({ bounceable: false, testOnly: false })
    : "";

  /* 1️⃣  Envoie l’adresse (1 seule fois) */
  useEffect(() => {
    if (!isConnected || hasSentWallet.current) return;
    hasSentWallet.current = true;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/wallet/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `tma ${window.Telegram?.WebApp?.initData}`,
      },
      body: JSON.stringify({ walletAddress: shortAddr }),
    }).catch(console.error);
  }, [isConnected, shortAddr]);

  /* 2️⃣  Solde TON (debounce 400 ms) */
  useEffect(() => {
    if (!isConnected) return;
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
    }, 400);
    return () => clearTimeout(id);
  }, [isConnected, rawAddr]);

  /* 3️⃣  Dépôt */
  const handleDeposit = async () => {
    const ton = parseFloat(amount);
    if (!ton || ton <= 0) return alert("Enter a valid amount");

    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          { address: DEPOSIT_ADDRESS, amount: (ton * 1e9).toFixed(0) },
        ],
      });

      new Audio("/assets/sounds/10.Moneyadded.mp3").play().catch(() => {});
      setStatus("🎉 Transaction sent! Processing…");

      setTimeout(() => {
        refreshWallet();
        setStatus("✅ Deposit processed.");
      }, 3_000);
    } catch {
      setStatus("❌ Transaction cancelled.");
    }
  };

  /* --------------------- RENDER --------------------- */
  return (
    <div className="w-full max-w-[400px] mx-auto p-6 text-white font-lato">
      {isConnected ? (
        <>
          <Banner text="Your wallet is connected" />

          <Field label="Address"  value={shortAddr} mono />
          <Field
            label="Balance"
            value={balance !== null ? `${balance} TON` : "Loading…"}
          />

          {/* montant */}
          <div className="mt-4">
            <label htmlFor="amt" className="text-sm text-gray-300 mb-1 block">
              Amount&nbsp;(TON)
            </label>
            <input
              id="amt"
              type="number"
              min="0"
              step="0.1"
              value={amount}
              placeholder="0.00"
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#29153B] border border-[#8646A4] rounded-xl px-3 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#8C4DFF] outline-none"
            />
          </div>

          {/* bouton + feedback */}
          <div className="flex flex-col items-center mt-6 gap-1">
            <Button label="Deposit" handleButtonClick={handleDeposit} />
            {status && <p className="text-sm">{status}</p>}
          </div>
        </>
      ) : (
        <ConnectPrompt openModal={() => tonConnectUI.openModal()} />
      )}
    </div>
  );
};

/* ---------- sous-composants ---------- */

const Banner = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 bg-[#1e1b2f] border border-green-500 rounded-xl p-3 text-sm mb-6">
    <span className="text-green-400 text-lg">✔</span>
    <span>{text}</span>
  </div>
);

interface FieldProps {
  label: string;
  value: string;
  mono?: boolean;
}
const Field = ({ label, value, mono = false }: FieldProps) => (
  <div className="mt-3">
    <p className="text-sm text-gray-300 mb-1">{label}</p>
    <div
      className={`bg-[#29153B] border border-[#8646A4] rounded-xl px-3 py-2 ${
        mono ? "font-mono break-all text-xs" : "font-bold text-sm"
      }`}
    >
      {value}
    </div>
  </div>
);

const ConnectPrompt = ({ openModal }: { openModal: () => void }) => (
  <div className="flex flex-col items-center gap-4">
    <p className="text-[15px] text-center">
      Connect your wallet to make a deposit.
    </p>
    <button
      onClick={openModal}
      className="bg-gradient-to-r from-[#5b2bff] to-[#00e1ff] py-2 px-6 rounded-xl font-bold hover:opacity-90 transition"
    >
      🔗 Connect Wallet
    </button>
  </div>
);

export default Deposit;
