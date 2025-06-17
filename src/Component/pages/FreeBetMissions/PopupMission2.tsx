import Button from "../../common/Button";

interface Props {
  onClose: () => void;
}

const PopupMission2 = ({ onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-[#1a0032] text-white rounded-2xl px-6 py-8 w-[90%] max-w-sm text-center border border-[#6e00b3] shadow-lg">
        <img
          src="/assets/party-corgi.png"
          alt="Success"
          className="mx-auto w-20 h-20 mb-4"
        />
        <h2 className="text-[20px] font-bold font-designer uppercase mb-2">
          MISSION 2 COMPLETED!
        </h2>
        <p className="text-[15px] font-lato mb-6">
          You’ve invited your friend and earned a free bet.
        </p>
        <Button onClick={onClose}>LET'S PLAY!</Button>
      </div>
    </div>
  );
};

export default PopupMission2;
