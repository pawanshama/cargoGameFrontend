/* src/Component/pages/FreeBetMissions/index.tsx */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../includes/Header";
import Footer from "../../includes/Footer";
import Mission1 from "./Mission1";
import Mission2 from "./Mission2";
import PopupMission1 from "./PopupMission1";
import PopupMission2 from "./PopupMission2";

/* ---------- Config ---------- */
const missions = [
  { id: 1, title: "Double Your First Deposit!" },
  { id: 2, title: "Invite Your Friends and Get Up to $150" },
];

/* ---------- Composant ---------- */
const FreeBetMissions: React.FC = () => {
  const [activeMission, setActiveMission] = useState<number | null>(null);
  const [activePopupMission, setActivePopupMission] = useState<number | null>(null);

  const [hasDeposited, setHasDeposited] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>();

  const [invitedCount, setInvitedCount] = useState(0);
  const [totalCashback, setTotalCashback] = useState(0);
  const [yourCashback, setYourCashback] = useState(0);
  const [friendsCashback, setFriendsCashback] = useState(0);

  const navigate = useNavigate();

  /* ---------- Effet : fetch missions ---------- */
  useEffect(() => {
    const initData = window.Telegram?.WebApp.initData;
    if (!initData) return;

    const fetchDepositStatus = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/deposit-status`,
          { headers: { Authorization: `tma ${initData}` } },
        );
        const data = await res.json();
        setHasDeposited(data.hasDeposited);
        setDepositAmount(data.depositAmount);
      } catch (err) {
        console.error("❌ deposit-status :", err);
      }
    };

    const fetchInviteStats = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/invite-status`,
          { headers: { Authorization: `tma ${initData}` } },
        );
        const data = await res.json();
        setInvitedCount(data.invitedCount ?? 0);
        setTotalCashback(data.totalCashback ?? 0);
        setYourCashback(data.yourCashback ?? 0);
        setFriendsCashback(data.friendsCashback ?? 0);
      } catch (err) {
        console.error("❌ invite-status :", err);
      }
    };

    fetchDepositStatus();
    fetchInviteStats();
  }, []);

  /* ---------- Rendu ---------- */
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

      {/* ---------- Cartes missions ---------- */}
      <div className="px-4 mt-6 flex flex-col gap-5">
        {missions.map((m) => (
          <button
            key={m.id}
            type="button"
            className="w-full border border-[#9752b9] rounded-xl px-5 py-4 flex justify-between items-center active:scale-95 transition-transform duration-100"
            onClick={() => setActiveMission(m.id)}         // ← garde supprimée
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

      {/* ---------- Overlays missions ---------- */}
      {activeMission === 1 && (
        <Mission1
          onBack={() => setActiveMission(null)}
          onCollect={() => setActivePopupMission(1)}
          hasDeposited={hasDeposited}
          depositAmount={depositAmount}
        />
      )}

      {activeMission === 2 && (
        <Mission2
          onBack={() => setActiveMission(null)}
          onCollect={() => setActivePopupMission(2)}
          invitedCount={invitedCount}
          totalCashback={totalCashback}
          yourCashback={yourCashback}
          friendsCashback={friendsCashback}
        />
      )}

      {/* ---------- Pop-ups collecte ---------- */}
      {activePopupMission === 1 && (
        <PopupMission1
          onClose={() => {
            setActivePopupMission(null);
            navigate("/bet");
          }}
        />
      )}
      {activePopupMission === 2 && (
        <PopupMission2
          onClose={() => {
            setActivePopupMission(null);
            navigate("/bet");
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default FreeBetMissions;
