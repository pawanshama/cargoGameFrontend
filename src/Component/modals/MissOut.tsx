import MissOutBag from "../../assets/images/missOutBag.png";
import MissOutBagOptimised from "../../assets/images/missOutBag.webp";
import AlternateButton from "../common/AlternateButton";
import Button from "../common/Button";
import ImgWithFallback from "../common/ImageWithFallback";
import { useNavigate } from "react-router-dom";

interface MissOutProps {
  isMissOut: boolean;
  setIsMissOut: (value: boolean) => void;
  isProfileShow: boolean;
  setIsProfileShow: (value: boolean) => void;
}

const MissOut: React.FC<MissOutProps> = ({
  isMissOut,
  setIsMissOut,
  isProfileShow,
  setIsProfileShow,
}) => {
  const handleClose = () => {
    setIsMissOut(!isMissOut);
  };

  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-10 flex flex-col backdrop-blur-[.3125rem] bg-blurBackground h-[100dvh] w-full max-w-[640px]">
      <div className="flex items-center justify-center h-full flex-col gap-6 w-full mx-auto">
        <ImgWithFallback
          src={MissOutBagOptimised}
          fallback={MissOutBag}
          alt="MissOutBag"
          loading="lazy"
          className="w-[456px] h-[456px]"
        />
        <div className="flex flex-col gap-3 w-full px-[2.375rem] -mt-[8.125rem]">
          <h1 className="text-center h2 text-textColor">
            Don't Miss Out on<span className="block text-primary">Free Bets!</span>
          </h1>
          <p className="subheading text-textColor text-center max-w-[314px] w-full mx-auto">
            It looks like you haven't verified your contact details yet. By
            skipping this step, you might be missing out on your chance to win
            free bets!
          </p>
        </div>
        <div className="flex gap-6 items-center justify-center flex-wrap px-[2.375rem]">
          <AlternateButton
            handleButtonClick={() => {
              setIsProfileShow(!isProfileShow);
              navigate("/wallet");
            }}
            title="Miss out"
            long
          />
          <Button
            type="button"
            handleButtonClick={handleClose}
            label="Verify Details"
            long
          />
        </div>
      </div>
    </div>
  );
};

export default MissOut;
