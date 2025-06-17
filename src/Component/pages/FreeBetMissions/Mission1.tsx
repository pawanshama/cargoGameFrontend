// src/pages/FreeBetMissions/Mission1.tsx

import React, { useEffect, useState } from "react";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit from "./Mission1AfterDeposit";
import { io as socketIOClient } from "socket.io-client";

interface Mission1Props {
  onBack: () => void;
  onCollect: () => void;
  hasDeposited: boolean;
  depositAmount?: number;
}

const Mission1: React.FC<Mission1Props> = ({
  onBack,
  onCollect,
  hasDeposited: initialHasDeposited,
  depositAmount: initialDepositAmount,
}) => {
  const [hasDeposited, setHasDeposited] = useState(initialHasDeposited);
  const [depositAmount, setDepositAmount] = useState<number | null>(
    initialDepositAmount ?? null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

    let socket: ReturnType<typeof socketIOClient> | null = null;

    const fetchDeposit = async () => {
      try {
        const res = await fetch(
          "https://corgi-in-space-backend-production.up.railway.app/api/user/deposit-status",
          {
            headers: {
              Authorization: `tma ${initData}`,
            },
          }
        );
        const data = await res.json();

        if (data?.hasDeposited && typeof data.depositAmount === "number") {
          setHasDeposited(true);
          setDepositAmount(data.depositAmount);
          setLoading(false);
          return true;
        }
      } catch (err) {
        console.error("❌ Failed to fetch deposit amount", err);
      }
      return false;
    };

    // 1. Check immédiat
    fetchDeposit().then((found) => {
      if (!found) {
        let tries = 0;
        const intervalId = setInterval(async () => {
          const success = await fetchDeposit();
          tries++;
          if (success || tries >= 6) clearInterval(intervalId);
        }, 5000);
      }
    });

    // 2. WebSocket pour détection instantanée
    if (telegramId) {
      socket = socketIOClient("https://corgi-in-space-backend-production.up.railway.app", {
        query: { telegramId: telegramId.toString() },
        transports: ["websocket"],
      });

      socket.on("first-deposit", (data) => {
        console.log("🎉 Dépôt détecté via WebSocket :", data);
        setHasDeposited(true);
        setDepositAmount(data.amount / 100); // si tu stockes en cents
        setLoading(false);
      });
    }

    // 3. Cleanup
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return hasDeposited && depositAmount !== null ? (
    <Mission1AfterDeposit
      onBack={onBack}
      onCollect={onCollect}
      depositAmount={depositAmount}
    />
  ) : (
    <Mission1BeforeDeposit onBack={onBack} />
  );
};

export default Mission1;
