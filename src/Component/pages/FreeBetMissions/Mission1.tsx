import React, { useEffect, useState } from "react";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit from "./Mission1AfterDeposit";

interface Mission1Props {
  onBack: () => void;
  onCollect: () => void;
}

const Mission1: React.FC<Mission1Props> = ({ onBack, onCollect }) => {
  const [depositAmount, setDepositAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepositStatus = async () => {
      const initData = window.Telegram?.WebApp?.initData;

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
          setDepositAmount(data.depositAmount);
        }
      } catch (err) {
        console.error("❌ Failed to fetch deposit status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepositStatus();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return depositAmount !== null ? (
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
