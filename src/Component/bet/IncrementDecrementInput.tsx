import React, { useState, useEffect, useMemo } from "react";
import { DecrementIcon, IcrementIcon } from "../../assets/iconset";
import useTelegramSafeSound from "../../hooks/useTelegramSafeSound";

interface IncrementDecrementInputProps {
  suggestions: number[];
  onAmountClick?: () => void;
  onAmountChange?: (value: number) => void;
}

const IncrementDecrementInput: React.FC<IncrementDecrementInputProps> = ({
  suggestions,
  onAmountClick,
  onAmountChange,
}) => {
  const [value, setValue] = useState(0);
  const [isIncrementPressed, setIsIncrementPressed] = useState(false);
  const [isDecrementPressed, setIsDecrementPressed] = useState(false);
  const [pressedSuggestion, setPressedSuggestion] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const playIncrementSound = useTelegramSafeSound("/assets/sounds/2+UPbet.mp3");
  const playDecrementSound = useTelegramSafeSound("/assets/sounds/1-LESSbet.mp3");

  const increment = () => {
    console.log("[Increment] +0.1");
    setIsIncrementPressed(true);
    setTimeout(() => setIsIncrementPressed(false), 100);
    setValue((prev) => parseFloat((prev + 0.1).toFixed(2)));
    playIncrementSound();
  };

  const decrement = () => {
    console.log("[Decrement] -0.1");
    setIsDecrementPressed(true);
    setTimeout(() => setIsDecrementPressed(false), 100);
    setValue((prev) => Math.max(0, parseFloat((prev - 0.1).toFixed(2))));
    playDecrementSound();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value.replace('$', '').replace(',', '.'));
    console.log("[Input] Changed to", newValue);
    setValue(isNaN(newValue) ? 0 : newValue);
  };

  const handleSuggestionClick = (suggestion: number) => {
    console.log(`[Suggestion] Clicked on ${suggestion}`);
    if (pressedSuggestion !== null) return;
    setValue((prev) => parseFloat((prev + suggestion).toFixed(2)));
    setPressedSuggestion(suggestion);
    if (onAmountClick) onAmountClick();
    setTimeout(() => setPressedSuggestion(null), 100);
  };

  const formatCurrency = (num: number) => `$${num}`;

  useEffect(() => {
    if (onAmountChange) onAmountChange(value);
  }, [value, onAmountChange]);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth);
    const timeout = setTimeout(updateWidth, 100);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const visibleSuggestions = useMemo(() => {
    const sliced =
      !windowWidth || windowWidth < 100
        ? suggestions
        : windowWidth <= 355
        ? suggestions.slice(0, 3)
        : windowWidth <= 500
        ? suggestions.slice(0, 4)
        : suggestions;
    console.log("[Responsive] visibleSuggestions =", sliced);
    return sliced;
  }, [suggestions, windowWidth]);

  return (
    <div className="flex flex-col items-center max-w-[232px] w-full flex-1">
      <div className="flex items-center gap-2 justify-between py-1 w-full">
        <button
          onClick={decrement}
          className={`w-10 h-10 rounded-full flex items-center justify-center border border-primary bg-primary shadow-[0px_2px_6px_0px_rgba(0,0,0,0.55)_inset] transition-transform duration-100 will-change-transform ${
            isDecrementPressed ? "scale-90" : "scale-100"
          }`}
        >
          <DecrementIcon />
        </button>

        <input
          type="text"
          value={formatCurrency(value)}
          onChange={handleInputChange}
          className="w-full flex-1 text-center border-0 bg-transparent text-white font-designer text-2xl leading-4 antialiased"
        />

        <button
          onClick={increment}
          className={`w-10 h-10 rounded-full flex items-center justify-center border border-primary bg-primary shadow-[0px_2px_6px_0px_rgba(0,0,0,0.55)_inset] transition-transform duration-100 will-change-transform ${
            isIncrementPressed ? "scale-90" : "scale-100"
          }`}
        >
          <IcrementIcon />
        </button>
      </div>

      <div className="w-full stroke h-[.0625rem] mb-4"></div>

      <div className="flex gap-3 justify-between items-center w-full">
        {visibleSuggestions.map((suggestion) => (
          <button
            key={`suggestion-${suggestion}`}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`w-[72px] h-[40px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.45)_inset] border border-secondary bg-gradient-to-b from-[#9752B8] to-[#613693] text-white rounded-2xl buttonFont text-lg flex items-center justify-center transition-transform duration-100 will-change-transform ${
  pressedSuggestion === suggestion ? "scale-90" : "scale-100"
}`}


          >
            {formatCurrency(suggestion)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IncrementDecrementInput;
