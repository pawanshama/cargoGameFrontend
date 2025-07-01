/* ------------------------------------------------------------------
   src/components/missions/Mission1AfterDeposit.tsx
   Affichage instantané, sans requête réseau : on lit le store global
   ------------------------------------------------------------------ */
import React, { useMemo } from "react";
import Button               from "../../common/Button";
import { formatFreeBet }    from "../../../utils/format-freebet";
import { useUserGame }      from "../../../store/useUserGame";

interface Mission1AfterDepositProps {
  onBack   : () => void;
  onCollect: () => void;
}

const TOTAL_PARTS = 5;

const Mission1AfterDeposit: React.FC<Mission1AfterDepositProps> = ({ onBack, onCollect }) => {
  /* --------- On récupère les données directement du store --------- */
  const { depositCents, mission1 } = useUserGame();

  /* Valeurs sûres (fallback 0 pour éviter NaN) */
  const unlockedParts = mission1?.unlockedParts ?? 0;
  const claimedParts  = mission1?.claimedParts  ?? 0;
  const cents         = depositCents ?? 0;            // ⬅️ toujours défini

  /* Calculs dérivés */
  const milestoneTON   = useMemo(() => cents / TOTAL_PARTS / 1000, [cents]);
  const claimableParts = Math.max(0, unlockedParts - claimedParts);
  const isCompleted    = claimedParts === TOTAL_PARTS;
  const nothingToClaim = claimableParts === 0;

  /* Si on n'a même pas un premier dépôt, on ne devrait pas être ici → fallback */
  if (!cents) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#160028]/90 z-50 text-white">
        <p className="animate-pulse">No deposit found…</p>
      </div>
    );
  }

  /* --------------------------- rendu --------------------------- */
  return (
    <div className="absolute inset-0 z-50 bg-[#160028]/95 overflow-y-auto">
      <div className="px-4 pt-10 pb-40 h-screen text-center overflow-y-auto">
        {/* EN‑TÊTE */}
        <h1 className="text-[28px] font-bold font-designer text-white uppercase mb-2">
          Mission 1 : Double your first deposit!
        </h1>

        <p className="text-sm text-white/80">
          Deposit once and get the same value in free bets. Place real bets to
          unlock each milestone.
        </p>

        {/* CARTE COLLECT */}
        <div className="mt-10 flex flex-col items-center gap-8">
          <div
            onClick={() => {
              if (nothingToClaim) return;
              new Audio("/assets/sounds/10.Moneyadded.mp3").play().catch(() => {});
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

          {/* BARRE DE PROGRESSION */}
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

          {/* Légende */}
          <div className="w-full max-w-[90%] flex justify-between -mt-2 text-xs text-white font-lato z-30">
            {Array.from({ length: TOTAL_PARTS }).map((_, i) => (
              <div key={i} className="flex flex-col items-center w-[20%] leading-tight text-center">
                <span className="text-[11px] mb-[2px]">Bet</span>
                <span className="text-[14px] font-bold">${formatFreeBet(milestoneTON)}</span>
                <span className={`text-[11px] mt-[4px] ${i < unlockedParts ? "text-[#00FFB2]" : "text-white/40"}`}>Get {formatFreeBet(milestoneTON)}<br />Free Bet</span>
              </div>
            ))}
          </div>

          {/* BOUTON COLLECT */}
          <div className="mt-4">
            <Button
              label={isCompleted ? "Completed" : nothingToClaim ? "Locked" : "Collect"}
              type="button"
              disabled={nothingToClaim}
              handleButtonClick={() => {
                if (nothingToClaim) return;
                new Audio("/assets/sounds/10.Moneyadded.mp3").play().catch(() => {});
                onCollect();
              }}
            />
          </div>
        </div>

        {/* FAQ --------------------------------------------------------*/}
        <p className="font-bold text-white text-lg underline font-designer uppercase mt-10 mb-6">How can I access my free bets?</p>
        <div className="mt-10 px-4 space-y-4">
          <div className="border border-[#9752b9] rounded-xl p-4">
            <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">STEP 1</h3>
            <p className="text-sm text-white/80">Deposit your first amount. For example, deposit ${(cents / 1000).toFixed(3)}.</p>
          </div>
          <div className="border border-[#9752b9] rounded-xl p-4">
            <h3 className="font-bold text-white text-lg mb-2 font-designer uppercase">STEP 2</h3>
            <p className="text-sm text-white/80">Place real bets. Each time you wager ${formatFreeBet(milestoneTON)} in total, you unlock ${formatFreeBet(milestoneTON)} of free bets.</p>
          </div>
        </div>

        {/* RETOUR */}
        <button className="mt-6 text-[#00FFB2] underline font-bold active:scale-95" onClick={onBack}>← Back to Missions</button>
      </div>
    </div>
  );
};

export default Mission1AfterDeposit;
