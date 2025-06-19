import React, { useState } from "react";
import CustomInput from "../common/Input";
import Button from "../common/Button";

interface WithdrawProps {
  inputValues: { [key: string]: string };
  handleInputChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
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

  const handleWithdrawSubmit = async () => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      setStatusMessage("❌ Connexion Telegram manquante.");
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
        setStatusMessage("✅ Retrait demandé avec succès.");
        refreshWallet();
        handleWithdraw();
      } else {
        setStatusMessage(`❌ ${result.error || "Échec du retrait."}`);
      }
    } catch (error) {
      console.error("❌ Erreur lors du retrait :", error);
      setStatusMessage("❌ Une erreur s'est produite.");
    }

    setLoading(false);
  };

  return (
    <form className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 text-white">
      <div className="w-full space-y-6 mb-[clamp(1rem,7vw,2.625rem)]">
        <CustomInput
          type="text"
          value={inputValues.amount}
          onChange={handleInputChange("amount")}
          placeholder="Enter amount to withdraw (min 0.1 TON)"
          label="Amount to withdraw"
          name="amount"
          availableText="TON available balance"
          max
        />
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