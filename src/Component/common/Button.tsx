import { MouseEventHandler } from "react";

interface ButtonProps {
  type: "submit" | "reset" | "button" | undefined;
  handleButtonClick: MouseEventHandler<HTMLButtonElement> | undefined;
  label: string;
  small?: boolean;
  additionalClass?: string;
  long?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type,
  handleButtonClick,
  label,
  small = false,
  additionalClass = "",
  long = false,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={handleButtonClick}
      disabled={disabled}
      className={`flex items-center h-[2.6875rem] 
        ${disabled ? "bg-disabled" : "bg-button shadow-[0px_4px_24px_0px_rgba(42,253,149,0.40)]"} 
        ${small ? "py-2 px-3" : "py-4"} 
        ${long ? "px-4" : "px-8"}
        rounded-full buttonFont
        transform transition-all duration-150 ease-in-out
        active:scale-95 hover:opacity-90
        ${additionalClass}
      `}
    >
      {label}
    </button>
  );
};

export default Button;
