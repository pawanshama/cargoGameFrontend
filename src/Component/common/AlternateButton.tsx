import { MouseEventHandler } from "react";
import useTelegramSafeSound from "../../hooks/useTelegramSafeSound";

interface ButtonProps {
  handleButtonClick: MouseEventHandler<HTMLButtonElement> | undefined;
  title?: string;
  long?: boolean;
}

const AlternateButton: React.FC<ButtonProps> = ({
  handleButtonClick,
  title = "Back",
  long = false,
}) => {
  // ✅ Son préchargé via AudioContext
  const playBackSound = useTelegramSafeSound("/assets/sounds/19Backbutton.mp3");

  const handleClickWithSound: MouseEventHandler<HTMLButtonElement> = (e) => {
    playBackSound();
    if (handleButtonClick) handleButtonClick(e);
  };

  return (
    <button
      type="button"
      onClick={handleClickWithSound}
      className={`flex items-center border border-secondary bg-activeTab py-4 rounded-[2.375rem] buttonFont text-white h-[2.6875rem] transition-transform duration-100 ease-in-out active:scale-95 ${long ? "px-4" : "px-8"}`}
    >
      {title}
    </button>
  );
};

export default AlternateButton;
