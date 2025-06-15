import React, { useState } from "react";
import { ArrowRight } from "../../assets/iconset";
import useTelegramSafeSound from "../../hooks/useTelegramSafeSound";

interface FAQItemProps {
  id: number;
  question: string;
  answer: React.ReactNode;
  defaultOpen?: boolean;
}

const FAQItem: React.FC<FAQItemProps> = ({
  id,
  question,
  answer,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // ✅ Son joué à l’ouverture/fermeture
  const playToggleSound = useTelegramSafeSound("/assets/sounds/6Downmenu.mp3");

  const toggleFAQ = () => {
    playToggleSound();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="bg-alternateBackground border border-secondary rounded-lg py-4 px-3 mb-4 last:mb-0">
      <button
        type="button"
        onClick={toggleFAQ}
        className="cursor-pointer bg-transparent h3 flex items-center justify-between w-full"
      >
        <div className="flex gap-2">
          <span className="min-w-5">{id}{"."}</span>
          <span className="text-left flex-1">{question}</span>
        </div>
        <span className={`${isOpen ? "rotate-90" : ""} transition-transform duration-300`}>
          <ArrowRight />
        </span>
      </button>

      {isOpen && (
        <div className="pl-5 text text-textColor flex flex-col gap-2">
          {answer}
        </div>
      )}
    </div>
  );
};

export default FAQItem;
