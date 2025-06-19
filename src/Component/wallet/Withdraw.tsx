import React, { useState, useEffect } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import Button from "../common/Button";

interface WithdrawProps {
  inputValues: { [key: string]: string };
  handleInputChange: (
    key: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWithdraw: () => void;
  refreshWallet: () => void;
}

const Withdraw: React.FC<WithdrawProps> = ({
  inputValues,
  handleInputChange,
  handleWithdraw,
  refreshWallet,
}) => {
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>("0.000");
  const wallet = useTonWallet();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet?.account?.address) return;
      try {
        const res = await fetch(
          `https://toncenter.com/api/v2/getAddressBalance?address=${wallet.account.address}`
        );
        const data = await res.json();
        const balanceTon = Number(data.result) / 1e9;
        setWalletBalance(balanceTon.toFixed(3));
      } catch (err) {
        console.error("❌ Balance fetch error:", err);
      }
    };
    fetchBalance();
  }, [wallet]);

  const setMax = () => {
    const syntheticEvent = {
      target: { value: walletBalance },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleInputChange("amount")(syntheticEvent);
  };

  const handleWithdrawSubmit = async () => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      setStatusMessage("❌ Telegram connection missing.");
      return;
    }

   const amount = parseFloat(inputValues.amount);
    const amountInCents = Math.round(amount * 100);

    if (isNaN(amount) || amount < 0.1) {
      setStatusMessage("❌ Montant invalide (min 0.1 TON).");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      const response = await fetch("https://corgi-in-space-backend-production.up.railway.app/api/wallet/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `tma ${initData}`,
        },
        body: JSON.stringify({ amount: amountInCents }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        // 🔊 Jouer le son de retrait
        const audio = new Audio("/assets/sounds/23.withdraw.mp3");
        audio.play().catch((err) => console.error("❌ Audio error:", err));

        setStatusMessage("✅ Withdraw request sent successfully.");
        refreshWallet();
        handleWithdraw();
      } else {
        setStatusMessage(`❌ ${result.error || "Withdraw failed."}`);
      }
    } catch (error) {
      console.error("❌ Withdraw error:", error);
      setStatusMessage("❌ An error occurred.");
    }

    setLoading(false);
  };

  return (
    <form className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 text-white">
      <div className="w-full space-y-6 mb-[clamp(1rem,7vw,2.625rem)]">
        {/* ✅ TON Available Balance bloc stylé comme Deposit */}
        <div>
          <label
            htmlFor="walletBalance"
            className="text-sm text-gray-300 font-semibold mb-1 block"
          >
            TON Available Balance
          </label>
          <div className="bg-[#29153B] border border-[#8646A4] rounded-xl px-3 py-2 text-sm text-white font-bold">
            {walletBalance} TON
          </div>
        </div>

        {/* ✅ Amount input bloc stylé comme Deposit */}
        <div>
          <label
            htmlFor="amount"
            className="text-sm text-gray-300 font-semibold mb-1 block"
          >
            Amount to withdraw
          </label>
          <div className="flex items-center bg-[#29153B] border border-[#8646A4] rounded-xl px-3 py-2">
            <input
              id="amount"
              type="text"
              name="amount"
              value={inputValues.amount}
              onChange={handleInputChange("amount")}
              placeholder="Enter amount to withdraw (min 0.1 TON)"
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8C4DFF]"
            />
            <button
              type="button"
              onClick={setMax}
              className="ml-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold py-1 px-3 rounded-lg transition-transform active:scale-95"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <Button
          label={loading ? "Processing..." : "Withdraw"}
          handleButtonClick={handleWithdrawSubmit}
          type="button"
          disabled={loading}
        />
        {statusMessage && (
          <p className="text-sm text-white text-center">{statusMessage}</p>
        )}
      </div>
    </form>
  );
};

export default Withdraw;
