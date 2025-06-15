import React from "react";

interface CustomInputDepositProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  copy?: boolean;
  rightElement?: JSX.Element;
  availableText?: string;
  onMaxClick?: () => void; // ✅ pour bouton Max
  showMax?: boolean;
}

const CustomInputDeposit: React.FC<CustomInputDepositProps> = ({
  label,
  copy,
  rightElement,
  value,
  availableText,
  onMaxClick,
  showMax = false,
  ...props
}) => {
  const handleCopy = () => {
    if (typeof value === "string") {
      navigator.clipboard.writeText(value);
    }
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm text-gray-300 font-semibold block">
          {label}
        </label>
      )}

      {availableText && (
        <div className="text-xs text-gray-400 mb-1">{availableText}</div>
      )}

      <div className="flex items-center bg-[#29153B] border border-[#8646A4] rounded-xl px-3 py-2">
        <input
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8C4DFF]"
          value={value}
          {...props}
        />

        {showMax && (
          <button
            type="button"
            onClick={onMaxClick}
            className="ml-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold py-1 px-3 rounded-lg transition-transform active:scale-95"
          >
            Max
          </button>
        )}

        {rightElement && (
          <div className="ml-2">{rightElement}</div>
        )}

        {copy && value && (
          <button
            type="button"
            onClick={handleCopy}
            className="ml-2 text-xs text-gray-400 hover:text-blue-400"
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomInputDeposit;
