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

    console.log("📦 initData :", initData);
    console.log("👤 telegramId :", telegramId);

    let socket: ReturnType<typeof socketIOClient> | null = null;

    // 🚨 Si pas d'initData → on annule
    if (!initData || !telegramId) {
      console.error("❌ initData ou telegramId manquant. Annulation de l'init.");
      setLoading(false);
      return;
    }

    // ✅ Fonction pour fetch le statut du dépôt
    const fetchDeposit = async () => {
  console.log("📡 Envoi requête /deposit-status");

  try {
    const res = await fetch(
      "https://corgi-in-space-backend-production.up.railway.app/api/user/deposit-status",
      {
        headers: {
          Authorization: `tma ${initData}`,
        },
      }
    );

    console.log("📨 Status HTTP:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erreur HTTP deposit-status :", errorText);
      setLoading(false); // ✅ obligatoire
      return false;
    }

    const data = await res.json();
    console.log("🎯 Résultat deposit-status :", data);

    if (data?.hasDeposited && typeof data.depositAmount === "number") {
      setHasDeposited(true);
      setDepositAmount(data.depositAmount);
      setLoading(false);
      return true;
    }
  } catch (err) {
    console.error("❌ Exception fetchDeposit:", err);
    setLoading(false); // ✅ obligatoire
  }

  setLoading(false); // ✅ si data non conforme
  return false;
};


    // ⏱️ 1. Fetch immédiat puis retries
    fetchDeposit().then((success) => {
      if (!success) {
        let tries = 0;
        const intervalId = setInterval(async () => {
          const ok = await fetchDeposit();
          tries++;
          if (ok || tries >= 6) clearInterval(intervalId);
        }, 5000);
      }
    });

    // 🔌 2. Connexion WebSocket
    socket = socketIOClient("https://corgi-in-space-backend-production.up.railway.app", {
      query: { telegramId: telegramId.toString() },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🔌 WebSocket connecté");
    });

    socket.on("first-deposit", (payload) => {
      console.log("🎁 Event WebSocket first-deposit :", payload);
      setHasDeposited(true);
      setDepositAmount(payload.amount / 100); // Convertir si stocké en cents
      setLoading(false);
    });

    socket.on("disconnect", () => {
      console.log("📴 WebSocket déconnecté");
    });

    // 🧼 3. Cleanup
    return () => {
      if (socket) {
        socket.disconnect();
        console.log("🧼 Socket proprement fermé");
      }
    };
}, [window.Telegram?.WebApp?.initData, window.Telegram?.WebApp?.initDataUnsafe?.user?.id]);


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
