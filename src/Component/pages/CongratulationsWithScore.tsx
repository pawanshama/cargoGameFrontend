import { useNavigate } from "react-router-dom";
import AlternateButton from "../common/AlternateButton";
import ScoreCardItem from "../congratulationsWIthScreen/ScoreCardItem";
import BetSection from "../common/BetSection";
import { useState } from "react";
import { randInt } from "three/src/math/MathUtils.js";
import InfoPool from "../modals/InfoPool";

interface ScoreCard {
  score?: number;
  text: string;
  showFees: boolean;
  price?: number;
}

const scoreData: ScoreCard[] = [
  { score: 500, text: "SCORE TO BEAT", showFees: false },
  { score: 1000, text: "YOUR SCORE", showFees: false },
  { price: 300, text: "YOUR BET", showFees: false },
  { price: 20, text: "POOL WAS", showFees: false },
  { price: 40, text: "YOU WIN", showFees: true },
  { score: 1000, text: "NEW POOL", showFees: false, price: 30 },
];

const CongratulationsWithScore = () => {
  const navigate = useNavigate();
  const [selectedRadio, setSelectedRadio] = useState("usdt");
  const [isInfoPool, setIsInfoPool] = useState(false);

  const handleInfoClick =() => (
    setIsInfoPool(!isInfoPool)
  )

  const handleRadioChange = (selectedId: string) => {
    setSelectedRadio(selectedId);
    console.log("Selected radio ID:", selectedId);
  };

  const suggestions = [2, 5, 10, 20];

  return (
    <>
    <div className="w-full h-[100dvh] overflow-y-auto">
      <div className="flex items-center justify-between h-full flex-col gap-2 py-8 px-5 w-full">
        <h2 className="h1 text-center text-textColor max-w-[16.25rem] w-full mx-auto">
          Congratulations! You won<span className="text-primary ml-2">40 USDT</span>
        </h2>
        <div className="grid grid-cols-2 gap-[.875rem] w-full">
          {scoreData.map((item) => (
            <ScoreCardItem key={randInt(1,100)} item={item} handleInfoClick={handleInfoClick} />
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 w-full">
          <BetSection
            suggestions={suggestions}
            selectedRadio={selectedRadio}
            onChange={handleRadioChange}
          />
          <AlternateButton handleButtonClick={() => navigate("/bet")} />
        </div>
      </div>
    </div>
    {isInfoPool && <InfoPool isInfoPool={isInfoPool} setIsInfoPool={setIsInfoPool} />}
    </>
  );
};

export default CongratulationsWithScore;
