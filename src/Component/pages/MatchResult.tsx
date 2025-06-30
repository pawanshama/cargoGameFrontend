import React, { useEffect } from "react";
import Button from "../common/Button";

interface MatchResultProps {
  result: "Won" | "Lost" | "Draw";
  userScore: number;
  opponentScore: number;
  betAmount: number;
  reward: number;
  onReplay: () => void;
  onQuit: () => void;
}

const MatchResult: React.FC<MatchResultProps> = ({
  result,
  userScore,
  opponentScore,
  betAmount,
  reward,
  onReplay,
  onQuit,
}) => {
  // 🔍 Log complet à chaque affichage
  useEffect(() => {
    console.log("🧾 MatchResult affiché avec les données suivantes :");
    console.table({
      result,
      userScore,
      opponentScore,
      betAmount,
      rewardDollars: reward / 1000,
    });
  }, [result, userScore, opponentScore, betAmount, reward]);

  const getTitle = () => {
    switch (result) {
      case "Won":
        return "🎉 Victory!";
      case "Lost":
        return "😓 Defeat";
      case "Draw":
        return "🤝 It's a draw!";
      default:
        return "Match Over";
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex flex-col items-center justify-center gap-6 px-4">
      <h2 className="text-3xl font-bold drop-shadow">{getTitle()}</h2>

      <div className="bg-white text-black w-full max-w-md rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-center">Match Recap</h3>
        <div className="text-sm space-y-2">
          <p>Your Score: <strong>{userScore}</strong></p>
          <p>Opponent Score: <strong>{opponentScore}</strong></p>
          <p>Bet Placed: <strong>${betAmount.toFixed(2)}</strong></p>
          <p>Reward Earned: <strong>${(reward / 100).toFixed(2)}</strong></p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          label="🔁 Play Again"
          handleButtonClick={() => {
            console.log("🔁 Bouton rejouer cliqué");
            onReplay();
          }}
        />
        <Button
          type="button"
          label="❌ Quit"
          handleButtonClick={() => {
            console.log("❌ Bouton quitter cliqué");
            onQuit();
          }}
        />
      </div>
    </div>
  );
};

export default MatchResult;
