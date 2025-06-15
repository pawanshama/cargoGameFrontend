import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Button from "../common/Button";
import CustomInput from "../common/Input";

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
  const navigate = useNavigate();

  const handleShare = async () => {
    const url = "https://dfjkzfnbkjzbf/...";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Corgi in Space",
          text: "Viens jouer avec moi et gagne des récompenses sur Corgi in Space !",
          url,
        });
      } catch (err) {
        console.error("Erreur lors du partage :", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("Lien copié dans le presse-papiers !");
      } catch (err) {
        console.error("Échec de la copie :", err);
      }
    }
  };

  const handleCollect = (missionId: number) => {
    setActivePopupMission(missionId);
  };

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
            onClick={() => setActiveMission(mission.id)}
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

      {/* MISSION 1 */}
      {activeMission === 1 && (
        <div className="absolute inset-0 z-50 bg-[#160028] bg-opacity-95 overflow-y-auto">
          <div className="px-4 pt-[40px] pb-40 h-screen text-center overflow-y-auto">
            <p className="text-[28px] font-bold font-designer text-white uppercase mb-2">
              MISSION 1: DOUBLE YOUR FIRST DEPOSIT!
            </p>

            <p className="text-sm text-white opacity-80">
              Deposit your first amount and get the same amount in free bets! Achieve milestones to unlock your rewards.
            </p>

            <div className="mt-10">
              <div className="flex flex-col items-center gap-8">
                <div
                  onClick={() => handleCollect(1)}
                  className="w-full max-w-[90%] rounded-2xl border-2 border-[#00FFB2] p-3 bg-[#1f0238] shadow-[0_0_15px_#00FFB2] flex items-center justify-center gap-2 flex-wrap cursor-pointer active:scale-95 transition-transform duration-100"
                >
                  <img
                    src="/assets/Gifticonfreebet.png"
                    alt="Gift"
                    className="w-[30px] h-[30px] object-contain"
                  />
                  <p className="text-[#00FFB2] text-[16px] sm:text-[18px] font-bold font-designer whitespace-nowrap text-center">
                    COLLECT $20.00 <span className="text-white">Free Bets</span>
                  </p>
                </div>

                <div className="relative w-full max-w-[90%]">
                  <div className="bg-[#3c1a57] rounded-full h-6 flex items-center px-1 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-4 mx-1 rounded-full ${
                          i === 0 ? "bg-[#00FFB2]" : "bg-[#5e2d82]"
                        }`}
                      ></div>
                    ))}
                  </div>

                  <div className="absolute bottom-[-12px] left-0 w-full h-4 flex justify-between z-20 px-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-[20%] flex justify-center">
                        <div className="w-[1px] h-[14px] bg-[#00FFB2] opacity-50" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full max-w-[90%] flex justify-between -mt-2 text-xs text-white font-lato z-30 relative">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center leading-tight text-center w-[20%]">
                      <span className="text-[11px] text-white mb-[2px]">Bet</span>
                      <span className="text-[14px] font-bold">$20</span>
                      <span className="text-[#00FFB2] mt-[4px] text-[11px]">Get $20 Free Bet</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Button label="Collect" type="button" handleButtonClick={() => handleCollect(1)} />
                </div>
              </div>
            </div>

            <p className="font-bold text-white text-lg underline font-designer uppercase text-center mt-10 mb-6">
  How can I access my freebets?
</p>

<div className="mt-10 px-4">

              <div className="border border-[#9752b9] rounded-xl p-4 mb-4">
                <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">STEP 1</h3>
                <p className="text-sm text-white opacity-80">
                  Deposit your first amount. For example, deposit $100.
                </p>
              </div>

              <div className="border border-[#9752b9] rounded-xl p-4">
                <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">STEP 2</h3>
                <p className="text-sm text-white opacity-80">
                  Unlock free bets step by step as you place bets, until the full value of your deposit is matched.
                </p>
              </div>
            </div>

            <button
              className="mt-6 text-[#00FFB2] underline font-bold transition active:scale-95"
              onClick={() => setActiveMission(null)}
            >
              ← Back to Missions
            </button>
          </div>
        </div>
      )}

      {/* MISSION 2 */}
      {activeMission === 2 && (
        <div className="absolute inset-0 z-50 bg-[#160028] bg-opacity-95 overflow-y-auto">
          <div className="px-4 pt-[40px] pb-40 h-screen text-center overflow-y-auto">
            <p className="text-[22px] font-bold text-white font-designer uppercase mb-2">
              MISSION 2: INVITE YOUR FRIENDS AND GET UP TO 5% CASHBACK!
            </p>

            <p className="text-sm text-white opacity-80">
              Invite friends and earn cashback on your bets and their bets!
            </p>

            <div className="mt-8 w-full max-w-[90%] mx-auto text-white">
              <div
                onClick={() => handleCollect(2)}
                className="w-full rounded-2xl border-2 border-[#00FFB2] p-3 bg-[#1f0238] shadow-[0_0_15px_#00FFB2] flex items-center justify-center gap-2 flex-wrap cursor-pointer active:scale-95 transition-transform duration-100 mb-6"
              >
                <img
                  src="/assets/Gifticonfreebet.png"
                  alt="Gift"
                  className="w-[30px] h-[30px] object-contain"
                />
                <p className="text-[#00FFB2] text-[16px] sm:text-[18px] font-bold font-designer whitespace-nowrap">
                  COLLECT $80.00 <span className="text-white">Free Bets</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center text-white font-lato">
                <div className="border border-[#5e2d82] rounded-xl p-3">
                  <p className="text-sm opacity-70">Friends signed up</p>
                  <p className="text-[24px] font-bold font-designer mt-1">3</p>
                </div>
                <div className="border border-[#5e2d82] rounded-xl p-3">
                  <p className="text-sm opacity-70">Total Cashback</p>
                  <p className="text-[24px] font-bold font-designer text-[#00FFB2] mt-1">$80</p>
                </div>
                <div className="border border-[#5e2d82] rounded-xl p-3">
                  <p className="text-sm opacity-70">Your Cashback</p>
                  <p className="text-[24px] font-bold font-designer mt-1">$50</p>
                </div>
                <div className="border border-[#5e2d82] rounded-xl p-3">
                  <p className="text-sm opacity-70">Cashback from friends</p>
                  <p className="text-[24px] font-bold font-designer mt-1">$30</p>
                </div>
              </div>
            </div>

            <div className="mt-6 mb-6 flex justify-center">
              <Button label="Collect" type="button" handleButtonClick={() => handleCollect(2)} />
            </div>

            <div className="mt-6 border border-[#9752b9] rounded-xl px-4 py-5 text-left flex flex-col gap-3">
              <p className="text-sm font-lato">
                <span className="inline-flex items-center gap-2">
                  <img src="/assets/humansicon.png" alt="invite" className="w-4 h-4" />
                  Invite friends to <span className="font-designer">CORGINSPACE</span>
                </span>
                <span className="float-right font-bold text-white font-designer uppercase">0/5</span>
              </p>

              <div className="flex items-center gap-2">
                <CustomInput
                  type="text"
                  value="https://dfjkzfnbkjzbf/..."
                  name="invite-url"
                  disabled
                  copy
                />
                <Button label="Invite" type="button" small handleButtonClick={handleShare} />
              </div>
            </div>
<p className="font-bold text-white text-lg underline font-designer uppercase text-center mt-10 mb-6">
  How can I access my freebets?
</p>

            <div className="mt-10 px-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="border border-[#9752b9] rounded-xl p-4 mb-4">
                  <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">
                    STEP {step}
                  </h3>
                  <p className="text-sm text-white opacity-80">
                    {{
                      1: "Invite 5 friends using your unique invitation link.",
                      2: "Once your friends sign up and make their first deposit, you become eligible for cashback.",
                      3: "Receive 5% cashback on all your bets and 5% cashback on bets placed by your invited friends.",
                    }[step]}
                  </p>
                </div>
              ))}
            </div>

            <button
              className="mt-6 text-[#00FFB2] underline font-bold transition active:scale-95"
              onClick={() => setActiveMission(null)}
            >
              ← Back to Missions
            </button>
          </div>
        </div>
      )}

      {/* POPUP MISSION 1 */}
      {activePopupMission === 1 && (
        <div className="fixed inset-0 z-50 bg-[#160028]/90 flex items-center justify-center">
          <div className="bg-[#2b1048] p-6 rounded-xl border border-[#9752b9] text-center w-[90%] max-w-sm relative">
            <img src="/assets/Gifticonfreebet.png" alt="Gift Box" className="w-[120px] mx-auto mb-6" />
            <p className="text-[18px] sm:text-[20px] font-bold font-designer text-white uppercase leading-tight mb-2">
              CONGRATULATIONS! YOU WON
            </p>
            <p className="text-[22px] sm:text-[24px] font-bold font-designer text-[#00FFB2] uppercase mb-6">
              $20 FREE BETS!
            </p>
            <div className="flex justify-center">
              <Button
                label="START PLAYING"
                type="button"
                handleButtonClick={() => {
                  setActivePopupMission(null);
                  navigate("/bet");
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* POPUP MISSION 2 */}
      {activePopupMission === 2 && (
        <div className="fixed inset-0 z-50 bg-[#160028]/90 flex items-center justify-center">
          <div className="bg-[#2b1048] p-6 rounded-xl border border-[#9752b9] text-center w-[90%] max-w-sm relative">
            <img src="/assets/Gifticonfreebet.png" alt="Gift Box" className="w-[120px] mx-auto mb-6" />
            <p className="text-[18px] sm:text-[20px] font-bold font-designer text-white uppercase leading-tight mb-2">
              CONGRATULATIONS! YOU WON
            </p>
            <p className="text-[22px] sm:text-[24px] font-bold font-designer text-[#00FFB2] uppercase mb-6">
              $80 FREE BETS!
            </p>
            <div className="flex justify-center">
              <Button
                label="START PLAYING"
                type="button"
                handleButtonClick={() => {
                  setActivePopupMission(null);
                  navigate("/bet");
                }}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default FreeBetMissions;
