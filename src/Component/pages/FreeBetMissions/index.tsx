import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../includes/Header";
import Footer from "../../includes/Footer";
import Mission1 from "./Mission1";
import Mission2 from "./Mission2";
import PopupMission1 from "./PopupMission1";
import PopupMission2 from "./PopupMission2";

const missions = [
  {
    id: 1,
    title: "Double Your First Deposit!",
  },
  {
    id: 2,
    title: "Invite Your Friends and Get Up to 150$",
  },
];

const FreeBetMissions = () => {
  const [activeMission, setActiveMission] = useState<number | null>(null);
  const [activePopupMission, setActivePopupMission] = useState<number | null>(null);
  const [hasDeposited, setHasDeposited] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<number | undefined>(undefined);

  const [invitedCount, setInvitedCount] = useState<number>(0);
  const [totalCashback, setTotalCashback] = useState<number>(0);
  const [yourCashback, setYourCashback] = useState<number>(0);
  const [friendsCashback, setFriendsCashback] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) return;

    const checkFirstDeposit = async () => {
      try {
        const res = await fetch("https://corgi-in-space-backend-production.up.railway.app/api/user/deposit-status", {
          headers: {
            Authorization: `tma ${initData}`,
          },
        });
        const data = await res.json();
        setHasDeposited(data.hasDeposited);
        setDepositAmount(data.depositAmount); // ✅
      } catch (err) {
        console.error("❌ Erreur lors de la récupération du statut de dépôt :", err);
      }
    };

    const fetchInviteStats = async () => {
      try {
        const res = await fetch("https://corgi-in-space-backend-production.up.railway.app/api/user/invite-status", {
          headers: {
            Authorization: `tma ${initData}`,
          },
        });
        const data = await res.json();
        setInvitedCount(data.invitedCount || 0);
        setTotalCashback(data.totalCashback || 0);
        setYourCashback(data.yourCashback || 0);
        setFriendsCashback(data.friendsCashback || 0);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des stats d’invitation :", err);
      }
    };

    checkFirstDeposit();
    fetchInviteStats();
  }, []);

  return (
    <div className="relative w-full bg-gradient-to-b from-[#160028] to-[#2b1048] text-white min-h-screen flex flex-col pb-28">
      <Header
        pageHeading={
          <span className="text-[28px] font-bold font-designer text-white uppercase">
            FREE BET MISSIONS
          </span>
        }
      />

      <div className="px-4 pt-2 text-center">
        <p className="text-[15px] text-white opacity-80">
          Exciting Rewards Await! Complete Missions and Earn Free Bets!
        </p>
      </div>

      <div className="px-4 mt-6 flex flex-col gap-5">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="w-full border border-[#9752b9] rounded-xl px-5 py-4 flex justify-between items-center cursor-pointer active:scale-95 transition-transform duration-100"
            onClick={() => {
              if (mission.id === 1 && hasDeposited) return;
              setActiveMission(mission.id);
            }}
          >
            <div className="flex items-center gap-3">
              <img src="/assets/rocket.png" alt="rocket" className="w-10 h-10" />
              <div className="flex flex-col leading-snug">
                <p className="text-white text-[13px] font-bold font-designer uppercase tracking-wide">
                  MISSION {mission.id}
                </p>
                <p className="text-[#00FFB2] text-[16px] font-bold font-lato leading-tight">
                  {mission.title}
                </p>
              </div>
            </div>
            <span className="text-white text-[30px] font-bold transition-transform duration-200">
              &gt;
            </span>
          </div>
        ))}
      </div>

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
