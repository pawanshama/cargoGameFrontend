/* ------------------------------------------------------------------
   src/components/missions/Mission1AfterDeposit.tsx
   ------------------------------------------------------------------ */
import React from "react";
import Button from "../../common/Button";
import { formatFreeBet } from "../../../utils/format-freebet";
import { useUserGame } from "../../../store/useUserGame";

// ──────────────────────────────────────────────────────────────────
interface Mission1AfterDepositProps {
  onBack   : () => void;
  onCollect: () => void;
}

const TOTAL_PARTS = 5;

const playCollectSound = () => {
  new Audio("/assets/sounds/10.Moneyadded.mp3")
    .play()
    .catch(err => console.error("❌ Audio error:", err));
};

/* ------------------------------------------------------------------ */
const Mission1AfterDeposit: React.FC<Mission1AfterDepositProps> = ({ onBack, onCollect }) => {
  /* Toutes les données viennent désormais du store global → affichage instantané */
  const { depositCents, mission1 } = useUserGame();

  /* Sécurité : tant que le store n’est pas peuplé, loader basique */
  if (depositCents === undefined || !mission1) {
    return (
      <div className="absolute inset-0 z-50 bg-[#160028]/95 flex items-center justify-center">
        <img src="/assets/loader.svg" alt="Loading" className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  /* ------------------------ dérivés ------------------------ */
  const { unlockedParts, claimedParts } = mission1;
  const milestoneTON     = depositCents / TOTAL_PARTS / 1000; // cents → TON
  const claimableParts   = Math.max(0, unlockedParts - claimedParts);
  const isCompleted      = claimedParts === TOTAL_PARTS;
  const nothingToClaim   = claimableParts === 0;

  /* ------------------------ rendu -------------------------- */
  return (
    <div className="absolute inset-0 z-50 bg-[#160028]/95 overflow-y-auto">
      <div className="px-4 pt-10 pb-40 h-screen text-center overflow-y-auto">
        {/*----------------- EN‑TÊTE ----------------*/}
        <h1 className="text-[28px] font-bold font-designer text-white uppercase mb-2">
          Mission 1 : Double your first deposit!
        </h1>
        <p className="text-sm text-white/80">
          Deposit once and get the same value in free bets. Place real bets to
          unlock each milestone.
        </p>

        {/*----------------- CARTE COLLECT -----------*/}
        <div className="mt-10 flex flex-col items-center gap-8">
          <div
            onClick={() => {
              if (nothingToClaim) return;
              playCollectSound();
              onCollect();
            }}
            className={`w-full max-w-[90%] rounded-2xl border-2 p-3 bg-[#1f0238] flex items-center justify-center gap-2 flex-wrap cursor-pointer active:scale-95 transition ${nothingToClaim ? "border-[#555] text-[#777] cursor-not-allowed" : "border-[#00FFB2] shadow-[0_0_15px_#00FFB2] animate-pulse-zoom"}`}
          >
            <img src="/assets/Gifticonfreebet.png" alt="Gift" className="w-[30px] h-[30px] object-contain" />
            <p className={`text-[16px] sm:text-[18px] font-bold font-designer whitespace-nowrap ${nothingToClaim ? "text-[#777]" : "text-[#00FFB2]"}`}>
              {isCompleted
                ? "ALL FREE BETS COLLECTED"
                : nothingToClaim
                ? `Bet ${formatFreeBet(milestoneTON)} more to unlock`
                : `COLLECT ${formatFreeBet(claimableParts * milestoneTON)} Free Bets`}
            </p>
          </div>

          {/*----------------- BARRE DE PROGRESSION ----*/}
          <div className="relative w-full max-w-[90%]">
            <div className="bg-[#3c1a57] rounded-full h-6 flex items-center px-1 relative z-10">
              {Array.from({ length: TOTAL_PARTS }).map((_, i) => (
                <div key={i} className={`flex-1 h-4 mx-1 rounded-full transition ${i < unlockedParts ? "bg-[#00FFB2]" : "bg-[#5e2d82]"}`} />
              ))}
            </div>
            <div className="absolute bottom-[-12px] left-0 w-full h-4 flex justify-between z-20 px-1">
              {Array.from({ length: TOTAL_PARTS }).map((_, i) => (
                <div key={i} className="w-[20%] flex justify-center">
                  <div className={`w-[1px] h-[14px] ${i < unlockedParts ? "bg-[#00FFB2]" : "bg-[#00FFB2]/50"}`} />
                </div>
              ))}
            </div>
          </div>

          {/*----------------- LÉGENDES ----------------*/}
          <div className="w-full max-w-[90%] flex justify-between -mt-2 text-xs text-white font-lato z-30">
            {Array.from({ length: TOTAL_PARTS }).map((_, i) => (
              <div key={i} className="flex flex-col items-center w-[20%] leading-tight text-center">
                <span className="text-[11px] mb-[2px]">Bet</span>
                <span className="text-[14px] font-bold">${formatFreeBet(milestoneTON)}</span>
                <span className={`text-[11px] mt-[4px] ${i < unlockedParts ? "text-[#00FFB2]" : "text-white/40"}`}>Get {formatFreeBet(milestoneTON)}<br />Free Bet</span>
              </div>
            ))}
          </div>

          {/*----------------- BOUTON COLLECT ---------------*/}
          <div className="mt-4">
            <Button
              label={isCompleted ? "Completed" : nothingToClaim ? "Locked" : "Collect"}
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

        {/*----------------- FAQ ---------------------------*/}
        <p className="font-bold text-white text-lg underline font-designer uppercase mt-10 mb-6">
          How can I access my free bets?
        </p>
        <div className="mt-10 px-4 space-y-4">
          <div className="border border-[#9752b9] rounded-xl p-4">
            <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">STEP 1</h3>
            <p className="text-sm text-white/80">
              Deposit your first amount. For example, deposit ${ (depositCents / 1000).toFixed(3) }.
            </p>
          </div>
          <div className="border border-[#9752b9] rounded-xl p-4">
            <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">STEP 2</h3>
            <p className="text-sm text-white/80">
              Place real bets. Each time you wager ${formatFreeBet(milestoneTON)} in total, you unlock ${formatFreeBet(milestoneTON)} of free bets.
            </p>
          </div>
        </div>

        {/*----------------- RETOUR ------------------------*/}
        <button className="mt-6 text-[#00FFB2] underline font-bold active:scale-95" onClick={onBack}>
          ← Back to Missions
        </button>
      </div>
    </div>
  );
};

export default Mission1AfterDeposit;
