/* --------------------------------------------------------------------------
   src/Component/pages/FreeBetMissions/index.tsx
   Ultra-modern, glassmorphic redesign ✨
-------------------------------------------------------------------------- */

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, ChevronRight } from "lucide-react";

import Header        from "../../includes/Header";
import Footer        from "../../includes/Footer";
import Mission1      from "./Mission1";
import Mission2      from "./Mission2";
import PopupMission1 from "./PopupMission1";
import PopupMission2 from "./PopupMission2";

/* -------------------------------------------------------------------------- */
/*                         MISSION CONFIGURATION                              */
/* -------------------------------------------------------------------------- */
const missions = [
  { id: 1, title: "Double Your First Deposit!" },
  { id: 2, title: "Invite Your Friends and Get Up to $150" },
] as const;

const API = import.meta.env.VITE_BACKEND_URL;

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */
const FreeBetMissions: React.FC = () => {
  /* --------------------------- local overlay state ------------------------ */
  const [activeMission, setActiveMission] = useState<number | null>(null);
  const [activePopup,   setActivePopup]   = useState<number | null>(null);

  /* Ces deux états ne sont plus affichés, mais on les conserve si tu veux
     ré-utiliser ensuite les infos du dépôt dans cette page.  */
  const [_hasDeposited,  _setHasDeposited]  = useState<boolean | undefined>();
  const [_depositAmount, _setDepositAmount] = useState<number | undefined>();

  /* “Invite friends” stats */
  const [invitedCount,    setInvited]   = useState(0);
  const [totalCashback,   setTotalCb]   = useState(0);
  const [yourCashback,    setYourCb]    = useState(0);
  const [friendsCashback, setFriendsCb] = useState(0);

  const navigate = useNavigate();
  const initData = window.Telegram?.WebApp.initData;

  /* ------------------------------ fetchers ------------------------------ */
  const fetchDepositStatus = useCallback(async () => {
    if (!initData) return;

    try {
      const res = await fetch(`${API}/api/user/deposit-status`, {
        headers: { Authorization: `tma ${initData}` },
      });
      const j = await res.json();
      _setHasDeposited(j.hasDeposited);
      _setDepositAmount(j.depositAmount);
    } catch (err) {
      console.error("❌ deposit-status :", err);
      _setHasDeposited(false);
    }
  }, [initData]);

  const fetchInviteStats = useCallback(async () => {
    if (!initData) return;

    try {
      const res = await fetch(`${API}/api/user/invite-status`, {
        headers: { Authorization: `tma ${initData}` },
      });
      const j = await res.json();
      setInvited(j.invitedCount      ?? 0);
      setTotalCb(j.totalCashback     ?? 0);
      setYourCb(j.yourCashback       ?? 0);
      setFriendsCb(j.friendsCashback ?? 0);
    } catch (err) {
      console.error("❌ invite-status :", err);
    }
  }, [initData]);

  /* ----------------------------- lifecycle ------------------------------ */
  useEffect(() => {
    fetchDepositStatus();
    fetchInviteStats();
  }, [fetchDepositStatus, fetchInviteStats]);

  /* ---------------------------------------------------------------------- */
  /*                                RENDER                                  */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="relative min-h-screen w-full font-lato text-white bg-gradient-to-b from-[#160028] via-[#1c0934] to-[#2b1048] pb-28 overflow-hidden">

      {/* décor */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-96 w-96 rounded-full bg-[#5b2bff]/50 blur-2xl opacity-40" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-[#00e1ff]/40 blur-2xl opacity-30" />

      <Header
        pageHeading={
          <span className="text-[28px] font-bold font-designer uppercase tracking-wider">
            FREE BET MISSIONS
          </span>
        }
      />

      {/* sous-titre */}
      <p className="mx-auto mt-2 max-w-md px-4 text-center text-[15px] text-white/80">
        Exciting Rewards Await! Complete missions and earn{" "}
        <span className="text-[#00FFB2] font-bold">free bets</span>!
      </p>

      {/* cartes missions */}
      <div className="mx-auto mt-8 flex w-full max-w-lg flex-col gap-6 px-4">
        {missions.map(({ id, title }) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => setActiveMission(id)}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="group relative overflow-hidden rounded-2xl p-[1px] shadow-lg shadow-black/40 backdrop-blur-md"
          >
            {/* dégradé bordure */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#5b2bff] via-[#7e3cff] to-[#00e1ff] opacity-70 group-hover:opacity-100" />
            <div className="flex items-center justify-between rounded-2xl bg-[#1d1233]/90 px-5 py-4">
              <div className="flex items-center gap-3">
                <Rocket className="h-9 w-9 text-[#00e1ff]" />
                <div>
                  <p className="font-designer text-sm font-bold uppercase opacity-90">
                    Mission {id}
                  </p>
                  <p className="font-semibold text-[#00FFB2]">{title}</p>
                </div>
              </div>
              <ChevronRight className="h-7 w-7 text-white/70 group-hover:translate-x-1 transition" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* overlays */}
      <AnimatePresence>
        {activeMission === 1 && (
          <Mission1
            onBack={() => setActiveMission(null)}
            onCollect={() => setActivePopup(1)}
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
      </AnimatePresence>

      {/* pop-ups */}
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
