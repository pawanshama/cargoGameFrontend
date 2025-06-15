import React, { useState, useRef, useEffect } from "react";
import { ArrowDownIcon, CryptoCurrencyIcon } from "../../assets/iconset";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  onChange: (selectedOption: Option) => void;
  placeholder?: string;
  dropDownId: string;
  label?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onChange,
  placeholder = "Select an option",
  dropDownId,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {label && (
        <label className="block mb-2 textBold text-textColor px-4">
          {label}
        </label>
      )}
      <button
        type="button"
        id={dropDownId}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 bg-alternateBackground border border-secondary w-full text-left flex items-center justify-between text text-textColor ${
          isOpen ? "rounded-t-[1.5rem]" : "rounded-[1.5rem]"
        }`}
      >
        <span className="flex items-center gap-[clamp(0.8rem,4vw,1.5625rem)]">
          <CryptoCurrencyIcon />
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isOpen ? (
          <span className="rotate-180">
            <ArrowDownIcon />
          </span>
        ) : (
          <ArrowDownIcon />
        )}
      </button>
      {isOpen && (
        <div className="flex flex-col bg-alternateBackground backdrop-blur-md rounded-b-[1.5rem] border border-t-0 border-secondary absolute top-full left-0 right-0 z-10">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className="p-3 cursor-pointer bg-transparent text text-textColor text-left border-b last:border-b-0 border-tableRow"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
