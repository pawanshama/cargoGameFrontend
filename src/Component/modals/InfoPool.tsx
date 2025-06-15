import { InfoIcon, PrimaryCloseIcon } from "../../assets/iconset";

interface InfoPoolProps {
  isInfoPool: boolean;
  setIsInfoPool: (value: boolean) => void;
}

const InfoPool: React.FC<InfoPoolProps> = ({ isInfoPool, setIsInfoPool }) => {
  const handleClose = () => {
    setIsInfoPool(!isInfoPool);
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-10 flex flex-col backdrop-blur-[.1563rem] bg-blurBackground h-[100dvh] w-full max-w-[640px]">
      <div className="flex items-center justify-center h-full flex-col px-2 max-w-[350px] w-full mx-auto">
        <div className="py-6 px-4 flex flex-col gap-6 rounded-2xl border border-secondary bg-alternateBackground">
          <div className="flex items-center justify-between">
            <InfoIcon />
            <button
              type="button"
              className="bg-transparent"
              onClick={handleClose}
            >
              <PrimaryCloseIcon />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="h2 text-white text-center">what is pool?</h2>
            <div className="text-[.875rem] text-textColor flex flex-col gap-4">
              <p>
                If you place a <strong>bet</strong> that <strong>exceeds</strong> the amount in your opponent&apos;s <strong>pool</strong>, the <strong>surplus</strong> of your bet will create a <strong>new pool</strong>.
              </p>
              <p>
                Other players will then need to beat the score of your pool. If they fail to surpass your score, you <strong>automatically</strong> win the <strong>game</strong> and their <strong>money</strong>.
              </p>
              <p>
                However, if they <strong>manage</strong> to beat your score, they will win the money in your pool.
              </p>
              <p>
                Example: you created a pool of <strong>$30 | 1,000</strong>, it means there is <strong>30$</strong> of your bet in the pool and you did a score of <strong>1,000</strong>
              </p>
              <p>
                <strong>You can track your pools in statistics section, in home page.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPool;
