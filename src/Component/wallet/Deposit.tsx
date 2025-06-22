import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import { useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import Button from "../common/Button";
import { Address } from "@ton/core";

interface DepositProps {
  refreshWallet: () => void;
}

const DEPOSIT_ADDRESS = "UQCcgQqpCCWy3YEzLLqRRQowXf5-YUC8nbPYP--WQm3dI8E8";

const Deposit: React.FC<DepositProps> = ({ refreshWallet }) => {
  const { user } = useUser();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [amountTON, setAmountTON] = useState("");
  const [walletBalance, setWalletBalance] = useState<null | string>(null);
  const [status, setStatus] = useState("");
  const [showDepositButton, setShowDepositButton] = useState(false);
  const hasSentWallet = useRef(false);

  const isWalletConnected = !!wallet?.account?.address;

  const rawAddress = wallet?.account?.address;
  const friendlyAddress = rawAddress
    ? Address.parse(rawAddress).toString({ bounceable: false, testOnly: false })
    : null;

  useEffect(() => {
    if (isWalletConnected && !hasSentWallet.current) {
      hasSentWallet.current = true;

      const initData = window.Telegram?.WebApp?.initData;

      fetch("https://corgi-in-space-backend-production.up.railway.app/api/wallet/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `tma ${initData}`,
        },
        body: JSON.stringify({
          walletAddress: Address.parse(wallet.account.address).toString({
            bounceable: false,
            testOnly: false,
          }),
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("✅ Wallet saved:", data))
        .catch((err) => console.error("❌ Wallet send error:", err));
    }
  }, [wallet, user]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!isWalletConnected) return;
      try {
        const res = await fetch(
          `https://toncenter.com/api/v2/getAddressBalance?address=${wallet.account.address}`
        );
        const data = await res.json();
        const balanceTon = Number(data.result) / 1e9;
        setWalletBalance(balanceTon.toFixed(3));
      } catch (err) {
        console.error("❌ Balance fetch error:", err);
        setWalletBalance("N/A");
      }
    };

    fetchBalance();
  }, [wallet]);

  useEffect(() => {
    setShowDepositButton(isWalletConnected);
  }, [isWalletConnected]);

  const handleDeposit = async () => {
    if (!amountTON || isNaN(Number(amountTON))) {
      return alert("Invalid amount");
    }

    const playSound = () => {
      const audio = new Audio("/assets/sounds/10.Moneyadded.mp3");
      audio.play().catch((err) => console.error("❌ Audio error:", err));
    };

    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: DEPOSIT_ADDRESS,
            amount: (parseFloat(amountTON) * 1e9).toFixed(0),
          },
        ],
      });

      playSound(); // 🔊 Jouer le son

      setStatus("✅ Transaction sent, awaiting confirmation...");

      setTimeout(() => {
        refreshWallet();
        setStatus("✅ Deposit is being processed!");
      }, 3000);
    } catch (err) {
      console.error("❌ Deposit error:", err);
      setStatus("❌ Error while sending the transaction.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 text-white">
      {isWalletConnected ? (
        <div className="w-full space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-[#1E1B2F] border border-green-500 rounded-xl px-3 py-2">
              <span className="text-green-400 text-lg">✅</span>
              <p className="text-sm text-white font-medium">
                Your wallet is successfully connected
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-300 font-semibold mb-1">Address</p>
              <div className="bg-[#29153B] border border-[#8646A4] rounded-xl px-3 py-2 text-xs text-white break-all font-mono">
                {friendlyAddress}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-300 font-semibold mb-1">Balance</p>
              <div className="bg-[#29153B] border border-[#8646A4] rounded-xl px-3 py-2 text-sm text-white font-bold">
                {walletBalance !== null ? `${walletBalance} TON` : "Loading..."}
              </div>
            </div>

            <div className="mb-2">
              <label htmlFor="amount" className="text-sm text-gray-300 font-semibold mb-1 block">
                Amount
              </label>
              <input
                id="amount"
                type="text"
                name="amount"
                value={amountTON}
                onChange={(e) => setAmountTON(e.target.value)}
                placeholder="Enter the amount to deposit"
                className="w-full bg-[#29153B] border border-[#8646A4] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8C4DFF]"
              />
            </div>
          </div>

          {showDepositButton && (
            <div className="flex flex-col items-center justify-center gap-2 relative z-0 mt-[-10px]">
              <div className="z-10">
                <Button
                  label="Deposit"
                  handleButtonClick={handleDeposit}
                  type="button"
                />
              </div>
              {status && (
                <p className="text-sm text-white text-center">{status}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center mt-6">
          <p className="text-sm text-white mb-2 text-center">
            Please connect your wallet to make a deposit.
          </p>
          <button
            onClick={() => tonConnectUI.openModal()}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-2 px-6 rounded-xl hover:opacity-90 transition"
          >
            🔗 Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default Deposit;
