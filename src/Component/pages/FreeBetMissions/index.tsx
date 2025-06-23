/* src/Component/pages/FreeBetMissions/index.tsx */

import { useEffect, useState, useCallback } from "react";
import { useNavigate }   from "react-router-dom";
import Header            from "../../includes/Header";
import Footer            from "../../includes/Footer";
import Mission1          from "./Mission1";
import Mission2          from "./Mission2";
import PopupMission1     from "./PopupMission1";
import PopupMission2     from "./PopupMission2";

/* ----- configuration des cartes ----- */
const missions = [
  { id: 1, title: "Double Your First Deposit!" },
  { id: 2, title: "Invite Your Friends and Get Up to $150" },
];

const API = import.meta.env.VITE_BACKEND_URL;

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */
const FreeBetMissions: React.FC = () => {
  /* ------------------------------------------------ state ------------------------------------------------ */
  const [activeMission,   setActiveMission]   = useState<number | null>(null);
  const [activePopup,     setActivePopup]     = useState<number | null>(null);

  const [hasDeposited,    setHasDeposited]    =
    useState<boolean | undefined>(undefined);     // ← undefined = loading
  const [depositAmount,   setDepositAmount]   = useState<number | undefined>();

  const [invitedCount,    setInvited]         = useState(0);
  const [totalCashback,   setTotalCb]         = useState(0);
  const [yourCashback,    setYourCb]          = useState(0);
  const [friendsCashback, setFriendsCb]       = useState(0);

  const navigate = useNavigate();

  /* ------------------------------------------------ fetch ------------------------------------------------ */
  const initData = window.Telegram?.WebApp.initData;

  const fetchDepositStatus = useCallback(async () => {
    if (!initData) return;
    try {
      const r   = await fetch(`${API}/api/user/deposit-status`, {
        headers: { Authorization: `tma ${initData}` },
      });
      const j   = await r.json();
      setHasDeposited(j.hasDeposited);
      setDepositAmount(j.depositAmount);
    } catch (err) {
      console.error("❌ deposit-status :", err);
      setHasDeposited(false);
    }
  }, [initData]);

  const fetchInviteStats = useCallback(async () => {
    if (!initData) return;
    try {
      const r = await fetch(`${API}/api/user/invite-status`, {
        headers: { Authorization: `tma ${initData}` },
      });
      const j = await r.json();
      setInvited(j.invitedCount     ?? 0);
      setTotalCb(j.totalCashback    ?? 0);
      setYourCb(j.yourCashback      ?? 0);
      setFriendsCb(j.friendsCashback?? 0);
    } catch (err) {
      console.error("❌ invite-status :", err);
    }
  }, [initData]);

  /* 1ᵉʳ chargement */
  useEffect(() => {
    fetchDepositStatus();
    fetchInviteStats();
  }, [fetchDepositStatus, fetchInviteStats]);

  /* ------------------------------------------------ render ------------------------------------------------ */
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#160028] to-[#2b1048] text-white flex flex-col pb-28">
      <Header
        pageHeading={
          <span className="text-[28px] font-bold font-designer uppercase">
            FREE BET MISSIONS
          </span>
        }
      />

      <p className="px-4 pt-2 text-center opacity-80 text-[15px]">
        Exciting Rewards Await! Complete Missions and Earn Free Bets!
      </p>

      {/* ---------------- CARTES ---------------- */}
      <div className="px-4 mt-6 flex flex-col gap-5">
        {missions.map((m) => (
          <button
            key={m.id}
            type="button"
            className="w-full border border-[#9752b9] rounded-xl px-5 py-4 flex justify-between items-center active:scale-95 transition-transform"
            onClick={() => setActiveMission(m.id)}
          >
            <div className="flex items-center gap-3">
              <img src="/assets/rocket.webp" alt="" className="w-10 h-10" />
              <div className="text-left leading-snug">
                <p className="text-[13px] font-bold font-designer uppercase">
                  MISSION {m.id}
                </p>
                <p className="text-[#00FFB2] text-[16px] font-bold font-lato">
                  {m.title}
                </p>
              </div>
            </div>
            <span className="text-[30px] font-bold">&gt;</span>
          </button>
        ))}
      </div>

      {/* ---------------- OVERLAYS ---------------- */}
      {activeMission === 1 && (
        <Mission1
          onBack={() => setActiveMission(null)}
          onCollect={() => setActivePopup(1)}
          hasDeposited={hasDeposited}
          depositAmount={depositAmount}
        />
      )}

      {activeMission === 2 && (
        <Mission2
          onBack={() => setActiveMission(null)}
          onCollect={() => setActivePopup(2)}
          invitedCount={invitedCount}
          totalCashback={totalCashback}
          yourCashback={yourCashback}
          friendsCashback={friendsCashback}
        />
      )}

      {/* ---------------- POP-UPS ---------------- */}
      {activePopup === 1 && (
        <PopupMission1
          onClose={() => {
            setActivePopup(null);
            navigate("/bet");
          }}
        />
      )}
      {activePopup === 2 && (
        <PopupMission2
          onClose={() => {
            setActivePopup(null);
            navigate("/bet");
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default FreeBetMissions;
