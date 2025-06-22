/* src/Component/pages/FreeBetMissions/Mission2.tsx
   — lien d’invitation visible dès la 1ʳᵉ connexion
   — compteurs branchés sur les props (invitedCount, …)
*/

import { useEffect, useState } from "react";
import Button from "../../common/Button";
import CustomInput from "../../common/Input";
import { useUser } from "../../context/UserContext";

interface Mission2Props {
  onBack: () => void;
  onCollect: () => void;
  invitedCount: number;
  totalCashback: number;
  yourCashback: number;
  friendsCashback: number;
}

const Mission2: React.FC<Mission2Props> = ({
  onBack,
  onCollect,
  invitedCount,
  totalCashback,
  yourCashback,
  friendsCashback,
}) => {
  const { user } = useUser();
  const [inviteLink, setInviteLink] = useState("");

  /* ------------------------------------------------------------ */
  /* Génère le lien dès que possible (user OU localStorage)       */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    /* 1. priorité : user context */
    let inviteCode: string | undefined =
      user?.referralMission?.inviteCode || undefined;

    /* 2. fallback : data déjà stockée localement (première session) */
    if (!inviteCode) {
      try {
        const stored = JSON.parse(
          localStorage.getItem("userDetails") || "{}",
        ) as { referralMission?: { inviteCode?: string } };
        inviteCode = stored.referralMission?.inviteCode;
      } catch {
        /* rien */
      }
    }

    /* 3. si trouvé → construit l’URL */
    if (inviteCode) {
      const link = `https://t.me/CorginSpaceBot?startapp=invite=${inviteCode}`;
      setInviteLink(link);
    }
  }, [user]);

  /* ------------------------------------------------------------ */
  /* Partage / copie                                              */
  /* ------------------------------------------------------------ */
  const handleShare = async () => {
    if (!inviteLink) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Corgi in Space",
          text:
            "🚀 BET - PLAY - TAKE THE CASH – Right Now\n\n" +
            "Bet. Play. Withdraw.\n" +
            "💸 +$200 in Free Bets for new players 🤑",
          url: inviteLink,
        });
      } else {
        await navigator.clipboard.writeText(inviteLink);
        alert("Link Copied !");
      }
    } catch (err) {
      console.error("Erreur partage / copie :", err);
    }
  };

  /* ------------------------------------------------------------ */
  /* Render                                                       */
  /* ------------------------------------------------------------ */
  return (
    <div className="absolute inset-0 z-50 bg-[#160028] bg-opacity-95 overflow-y-auto">
      <div className="px-4 pt-[40px] pb-40 h-screen text-center overflow-y-auto">
        <p className="text-[22px] font-bold text-white font-designer uppercase mb-2">
          MISSION 2: INVITE YOUR FRIENDS AND GET UP TO 5% CASHBACK!
        </p>

        <p className="text-sm text-white opacity-80">
          Invite friends and earn cashback on your bets and their bets!
        </p>

        {/* ----------- Widget Collect ----------- */}
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
              COLLECT ${totalCashback.toFixed(2)}{" "}
              <span className="text-white">Free Bets</span>
            </p>
          </div>

          {/* ----------- Statistiques ----------- */}
          <div className="grid grid-cols-2 gap-4 text-center text-white font-lato">
            {[
              {
                label: "Friends signed up",
                value: invitedCount,
                highlight: false,
              },
              {
                label: "Total Cashback",
                value: `$${totalCashback.toFixed(2)}`,
                highlight: true,
              },
              {
                label: "Your Cashback",
                value: `$${yourCashback.toFixed(2)}`,
                highlight: false,
              },
              {
                label: "Cashback from friends",
                value: `$${friendsCashback.toFixed(2)}`,
                highlight: false,
              },
            ].map(({ label, value, highlight }) => (
              <div
                key={label}
                className="border border-[#5e2d82] rounded-xl p-3"
              >
                <p className="text-sm opacity-70">{label}</p>
                <p
                  className={
                    "text-[24px] font-bold font-designer mt-1" +
                    (highlight ? " text-[#00FFB2]" : "")
                  }
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ----------- Bouton Collect ----------- */}
        <div className="mt-6 mb-6 flex justify-center">
          <Button label="Collect" type="button" handleButtonClick={onCollect} />
        </div>

        {/* ----------- Lien d’invitation ----------- */}
        <div className="mt-6 border border-[#9752b9] rounded-xl px-4 py-5 text-left flex flex-col gap-3">
          <p className="text-sm font-lato">
            <span className="inline-flex items-center gap-2">
              <img
                src="/assets/humansicon.png"
                alt="invite"
                className="w-4 h-4"
              />
              Invite friends to{" "}
              <span className="font-designer">CORGINSPACE</span>
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
            <Button
              label="Invite"
              type="button"
              small
              handleButtonClick={handleShare}
            />
          </div>
        </div>

        {/* ----------- Steps ----------- */}
        <p className="font-bold text-white text-lg underline font-designer uppercase text-center mt-10 mb-6">
          How can I access my freebets?
        </p>

        <div className="mt-10 px-4">
          {[
            "Invite 5 friends using your unique invitation link.",
            "Once your friends sign up and make their first deposit, you become eligible for cashback.",
            "Receive 5% cashback on all your bets and 5% cashback on bets placed by your invited friends.",
          ].map((text, idx) => (
            <div
              key={idx}
              className="border border-[#9752b9] rounded-xl p-4 mb-4"
            >
              <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">
                STEP {idx + 1}
              </h3>
              <p className="text-sm text-white opacity-80">{text}</p>
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
