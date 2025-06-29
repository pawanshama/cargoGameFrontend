/* ------------------------------------------------------------------
   src/components/missions/Mission1AfterDeposit.tsx
   ------------------------------------------------------------------ */
import React, { useRef } from "react";
import Button             from "../../common/Button";
import { formatFreeBet }  from "../../../utils/format-freebet";
import { useUserGame }    from "../../../store/useUserGame";   // ← store global

/*────────────── PROPS (toujours acceptées pour rétro-compat) ──────────────*/
interface Mission1AfterDepositProps {
  onBack       : () => void;
  onCollect    : () => void;
  depositAmount: number;  // 💰 premier dépôt (en cents)
  unlockedParts?: number; // 0-5 (fallback si store vide)
  claimedParts ?: number; // 0-5 (fallback si store vide)
}

/*────────────── SFX (objet Audio instancié une seule fois) ──────────────*/
const useCollectSfx = () => {
  const ref = useRef(new Audio("/assets/sounds/10.Moneyadded.mp3"));
  return () => ref.current.play().catch(() => {});
};

const TOTAL_PARTS = 5;

/*──────────────────────────────────────────────────────────────────────────*/
const Mission1AfterDeposit: React.FC<Mission1AfterDepositProps> = ({
  onBack,
  onCollect,
  depositAmount,
  unlockedParts: unlockedFromProps = 0,
  claimedParts : claimedFromProps  = 0,
}) => {
  /*───────────── lecture store ─────────────*/
  const { mission1 }   = useUserGame();
  const unlockedStore  = mission1?.unlockedParts;
  const claimedStore   = mission1?.claimedParts;

  /* priorité store → sinon props */
  const unlockedParts  = unlockedStore ?? unlockedFromProps;
  const claimedParts   = claimedStore  ?? claimedFromProps;

  /*───────────── dérivés ─────────────*/
  const milestone      = (depositAmount / TOTAL_PARTS) / 1000;
  const claimableParts = Math.max(0, unlockedParts - claimedParts);
  const isCompleted    = claimedParts === TOTAL_PARTS;
  const nothingToClaim = claimableParts === 0;

  const playCollectSound = useCollectSfx();

  /*───────────── rendu ─────────────*/
  return (
    <div className="absolute inset-0 z-50 bg-[#160028]/95 overflow-y-auto">
      <div className="px-4 pt-10 pb-40 h-screen text-center overflow-y-auto">
        {/* EN-TÊTE */}
        <h1 className="text-[28px] font-bold font-designer text-white uppercase mb-2">
          Mission 1 : Double your first deposit!
        </h1>
        <p className="text-sm text-white/80">
          Deposit once and get the same value in free bets. Place real bets to
          unlock each milestone.
        </p>

        {/* CARTE « COLLECT » */}
        <div className="mt-10 flex flex-col items-center gap-8">
          <div
            onClick={() => {
              if (nothingToClaim) return;
              playCollectSound();
              onCollect();
            }}
            className={`w-full max-w-[90%] rounded-2xl border-2 p-3
              bg-[#1f0238] flex items-center justify-center gap-2 flex-wrap
              cursor-pointer active:scale-95 transition
              ${
                nothingToClaim
                  ? "border-[#555] text-[#777] cursor-not-allowed"
                  : "border-[#00FFB2] shadow-[0_0_15px_#00FFB2] animate-pulse-zoom"
              }`}
          >
            <img
              src="/assets/Gifticonfreebet.png"
              alt="Gift"
              className="w-[30px] h-[30px] object-contain"
            />
            <p className={`text-[16px] sm:text-[18px] font-bold font-designer
                ${nothingToClaim ? "text-[#777]" : "text-[#00FFB2]"}`}>
              {isCompleted
                ? "ALL FREE BETS COLLECTED"
                : nothingToClaim
                ? `Bet ${formatFreeBet(milestone)} more to unlock`
                : `COLLECT ${formatFreeBet(claimableParts * milestone)} Free Bets`}
            </p>
          </div>

          {/* BARRE DE PROGRESSION */}
          <div className="relative w-full max-w-[90%]">
            <div className="bg-[#3c1a57] rounded-full h-6 flex items-center px-1 relative z-10">
              {Array.from({ length: TOTAL_PARTS }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-4 mx-1 rounded-full transition
                    ${i < unlockedParts ? "bg-[#00FFB2]" : "bg-[#5e2d82]"}`}
                />
              ))}
            </div>
            <div className="absolute bottom-[-12px] left-0 w-full h-4 flex justify-between z-20 px-1">
              {Array.from({ length: TOTAL_PARTS }).map((_, i) => (
                <div key={i} className="w-[20%] flex justify-center">
                  <div
                    className={`w-[1px] h-[14px] ${
                      i < unlockedParts ? "bg-[#00FFB2]" : "bg-[#00FFB2]/50"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* BOUTON COLLECT (redondant) */}
          <div className="mt-4">
            <Button
              label={
                isCompleted
                  ? "Completed"
                  : nothingToClaim
                  ? "Locked"
                  : "Collect"
              }
              type="button"
              disabled={nothingToClaim}
              handleButtonClick={() => {
                if (nothingToClaim) return;
                playCollectSound();
                onCollect();
              }}
            />
          </div>
        </div>

        {/* SECTION AIDE */}
        <p className="font-bold text-white text-lg underline font-designer uppercase mt-10 mb-6">
          How can I access my free bets?
        </p>
        <div className="mt-10 px-4 space-y-4">
          <div className="border border-[#9752b9] rounded-xl p-4">
            <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">
              STEP 1
            </h3>
            <p className="text-sm text-white/80">
              Deposit your first amount. For example, deposit $
              {(depositAmount / 1000).toFixed(3)}.
            </p>
          </div>
          <div className="border border-[#9752b9] rounded-xl p-4">
            <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">
              STEP 2
            </h3>
            <p className="text-sm text-white/80">
              Place real bets. Each time you wager $
              {formatFreeBet(milestone)} in total, you unlock $
              {formatFreeBet(milestone)} of free bets.
            </p>
          </div>
        </div>

        {/* LIEN RETOUR */}
        <button
          className="mt-6 text-[#00FFB2] underline font-bold active:scale-95"
          onClick={onBack}
        >
          ← Back to Missions
        </button>
      </div>
    </div>
  );
};

export default Mission1AfterDeposit;
