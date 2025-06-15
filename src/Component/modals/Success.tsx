import WalletSuccessImg from "../../assets/images/walletSuccessImg.png";
import WalletSuccessImgOptimised from "../../assets/images/walletSuccessImg.webp";
import Button from "../common/Button";
import ImgWithFallback from "../common/ImageWithFallback";

interface SuccessProps {
  isSuccess: boolean;
  setIsSuccess: (value: boolean) => void;
}

const Success: React.FC<SuccessProps> = ({ isSuccess, setIsSuccess }) => {
  const handleClose = () => {
    setIsSuccess(!isSuccess);
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-10 flex flex-col backdrop-blur-[.3125rem] bg-blurBackground h-[100dvh] w-full max-w-[640px]">
      <div className="flex items-center justify-center h-full flex-col px-2 max-w-[350px] w-full mx-auto">
        <ImgWithFallback
          src={WalletSuccessImgOptimised}
          fallback={WalletSuccessImg}
          alt="Wallet Success"
          loading="lazy"
          className="w-[9.3125rem] h-[9.3125rem] mb-6"
        />
        <h2 className="h1 text-center text-white mb-2">Congratulations</h2>
        <p className="subheading text-textColor mb-6 text-center">
          Your request has been received. The funds will appear in your wallet
          within a few minutes.
        </p>
        <Button type="button" handleButtonClick={handleClose} label="ok" />
      </div>
    </div>
  );
};

export default Success;
