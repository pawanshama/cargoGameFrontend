import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  type?: "submit" | "reset" | "button";
  handleButtonClick?: MouseEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>; // ✅ Ajouté pour compatibilité
  label?: string;
  children?: ReactNode;
  small?: boolean;
  additionalClass?: string;
  long?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  handleButtonClick,
  onClick, // ✅ pris en compte
  label,
  children,
  small = false,
  additionalClass = "",
  long = false,
  disabled = false,
}) => {
  const clickHandler = onClick || handleButtonClick;

  return (
    <button
      type={type}
      onClick={clickHandler}
      disabled={disabled}
      className={`flex items-center justify-center h-[2.6875rem]
        ${disabled ? "bg-disabled" : "bg-button shadow-[0px_4px_24px_0px_rgba(42,253,149,0.40)]"} 
        ${small ? "py-2 px-3" : "py-4"} 
        ${long ? "px-4" : "px-8"}
        rounded-full buttonFont
        transform transition-all duration-150 ease-in-out
        active:scale-95 hover:opacity-90
        ${additionalClass}
      `}
    >
      {children ?? label}
    </button>
  );
};

export default Button;
