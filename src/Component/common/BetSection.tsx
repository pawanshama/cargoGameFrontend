import IncrementDecrementInput from "../bet/IncrementDecrementInput";
import DynamicRadio from "../bet/RadioButtons";
import Button from "../common/Button";

interface BetSectionProps {
  suggestions: number[];
  selectedRadio: string;
  onChange: (selectedId: string) => void;
}

const BetSection: React.FC<BetSectionProps> = ({
  suggestions,
  selectedRadio,
  onChange,
}) => {
  return (
    <div className="p-4 flex flex-col gap-[.625rem] rounded-2xl backdrop-blur-[.4375rem] border border-secondary bg-alternateBackground w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <DynamicRadio
            label="USDT"
            id="usdt"
            name="bet"
            selectedId={selectedRadio}
            onChange={onChange}
          />
          <DynamicRadio
            label="Free Bet"
            id="free-bet"
            name="bet"
            selectedId={selectedRadio}
            onChange={onChange}
          />
          <DynamicRadio
            label="Play Demo"
            id="play-demo"
            name="bet"
            selectedId={selectedRadio}
            onChange={onChange}
          />
        </div>
        <div className="flex flex-col gap-1 items-center text-center">
          <p className="textSmall text-white">Balance Available</p>
          <p className="text-base text-white font-black leading-4 flex gap-1">
            0.00<span className="text-xs font-normal">TON</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <IncrementDecrementInput suggestions={suggestions} />
        <div className="w-full flex justify-end">
          <Button
            type="button"
            label="Bet"
            additionalClass="!px-3 w-full text-center justify-center max-w-[5.375rem]"
            handleButtonClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default BetSection;
