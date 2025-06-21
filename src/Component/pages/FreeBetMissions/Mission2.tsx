import { useEffect, useState } from "react";
import Button from "../../common/Button";
import CustomInput from "../../common/Input";
import { useUser } from "../../context/UserContext"; // 👈 pour accéder à user

interface Mission2Props {
  onBack: () => void;
  onCollect: () => void;
  invitedCount: number;
  totalCashback: number;
  yourCashback: number;
  friendsCashback: number;
}

const Mission2 = ({
  onBack,
  onCollect,
  invitedCount,
  totalCashback,
  yourCashback,
  friendsCashback,
}: Mission2Props) => {
  const [inviteLink, setInviteLink] = useState("");
  const { user } = useUser(); // ✅ récupère user

  useEffect(() => {
  const inviteCode = user?.referralMission?.inviteCode;
  if (inviteCode) {
    const link = `https://t.me/CorginSpaceBot?startapp=invite=${inviteCode}`;
    setInviteLink(link);
  }
}, [user]);




  const handleShare = async () => {
    if (!inviteLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Corgi in Space",
          text: "Viens jouer avec moi et gagne des récompenses sur Corgi in Space !",
          url: inviteLink,
        });
      } catch (err) {
        console.error("Erreur lors du partage :", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(inviteLink);
        alert("Lien copié dans le presse-papiers !");
      } catch (err) {
        console.error("Échec de la copie :", err);
      }
    }
  };


  return (
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
            onClick={onCollect}
            className="w-full rounded-2xl border-2 border-[#00FFB2] p-3 bg-[#1f0238] shadow-[0_0_15px_#00FFB2] flex items-center justify-center gap-2 flex-wrap cursor-pointer active:scale-95 transition-transform duration-100 animate-pulse-zoom mb-6"
          >
            <img
              src="/assets/Gifticonfreebet.png"
              alt="Gift"
              className="w-[30px] h-[30px] object-contain"
            />
            <p className="text-[#00FFB2] text-[16px] sm:text-[18px] font-bold font-designer whitespace-nowrap">
              COLLECT ${totalCashback.toFixed(2)} <span className="text-white">Free Bets</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center text-white font-lato">
            <div className="border border-[#5e2d82] rounded-xl p-3">
              <p className="text-sm opacity-70">Friends signed up</p>
              <p className="text-[24px] font-bold font-designer mt-1">{invitedCount}</p>
            </div>
            <div className="border border-[#5e2d82] rounded-xl p-3">
              <p className="text-sm opacity-70">Total Cashback</p>
              <p className="text-[24px] font-bold font-designer text-[#00FFB2] mt-1">
                ${totalCashback.toFixed(2)}
              </p>
            </div>
            <div className="border border-[#5e2d82] rounded-xl p-3">
              <p className="text-sm opacity-70">Your Cashback</p>
              <p className="text-[24px] font-bold font-designer mt-1">${yourCashback.toFixed(2)}</p>
            </div>
            <div className="border border-[#5e2d82] rounded-xl p-3">
              <p className="text-sm opacity-70">Cashback from friends</p>
              <p className="text-[24px] font-bold font-designer mt-1">${friendsCashback.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 mb-6 flex justify-center">
          <Button label="Collect" type="button" handleButtonClick={onCollect} />
        </div>

        <div className="mt-6 border border-[#9752b9] rounded-xl px-4 py-5 text-left flex flex-col gap-3">
          <p className="text-sm font-lato">
            <span className="inline-flex items-center gap-2">
              <img src="/assets/humansicon.png" alt="invite" className="w-4 h-4" />
              Invite friends to <span className="font-designer">CORGINSPACE</span>
            </span>
            <span className="float-right font-bold text-white font-designer uppercase">
              {invitedCount}/5
            </span>
          </p>

          <div className="flex items-center gap-2 mt-2">
            <CustomInput
              type="text"
              value={inviteLink}
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
              <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">STEP {step}</h3>
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
          onClick={onBack}
        >
          ← Back to Missions
        </button>
      </div>
    </div>
  );
};

export default Mission2;
