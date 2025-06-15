import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { CheckedIcon } from "../../assets/iconset";

interface CustomInputProps {
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  name: string;
  copy?: boolean;
  max?: boolean;
  innerButton?: string;
  onClickInnerButton?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  inputIcon?: React.ReactNode;
  availableText?: string;
  checkedItem?: boolean;
  bgChange?: boolean;
  helpText?: string;
  numericMode?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  type = "text",
  value,
  onChange,
  placeholder = "",
  label = "",
  name,
  copy = false,
  max = false,
  innerButton,
  onClickInnerButton,
  disabled = copy,
  inputIcon,
  availableText,
  checkedItem,
  bgChange = false,
  helpText,
  numericMode = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copyText, setCopyText] = useState("Copy");

  useEffect(() => {
    if (innerButton && !disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const copyToClipboard = async () => {
    if (inputRef.current) {
      try {
        await navigator.clipboard.writeText(inputRef.current.value);
        setCopyText("Copied!");
        setTimeout(() => setCopyText("Copy"), 2000);
        console.log("Copied Text:", inputRef.current.value);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 justify-between px-4">
        {label && (
          <label
            className="flex items-center gap-1.5 mb-2 textBold text-textColor"
            htmlFor={name}
          >
            {label} {checkedItem && <CheckedIcon />}
          </label>
        )}
        {availableText && (
          <p className="textSmall text-textColor">{availableText}</p>
        )}
      </div>
      <div className="relative w-full">
        {inputIcon && (
          <span className="absolute top-1/2 -translate-y-1/2 left-3">
            {inputIcon}
          </span>
        )}
        <input
          ref={inputRef}
          type={type}
          value={value}
          inputMode={numericMode ? "numeric" : "text"}
          pattern={numericMode ? "[0-9+]*" : "string"}
          onChange={onChange}
          placeholder={placeholder}
          id={name}
          name={name}
          disabled={disabled}
          className={`input ${inputIcon && "pl-12"} ${
            innerButton && "pr-20 truncate"
          } ${copy && "pr-20 truncate"} ${max && "pr-20 truncate"}`}
        />
        {copy && (
          <button
            type="button"
            onClick={copyToClipboard}
            className="smallButton absolute top-1/2 -translate-y-1/2 right-3 uppercase"
          >
            {copyText}
          </button>
        )}
        {max && (
          <button
            type="button"
            className="smallButton absolute top-1/2 -translate-y-1/2 right-3"
          >
            Max
          </button>
        )}
        {innerButton && (
          <button
            type="button"
            onClick={onClickInnerButton}
            className={`rounded-2xl py-1 px-2 text-white text text-center absolute top-1/2 -translate-y-1/2 right-3 ${
              bgChange ? "bg-secondary" : "bg-button"
            }`}
          >
            {innerButton}
          </button>
        )}
      </div>
      {helpText && <p className="text text-textColor mt-3">{helpText}</p>}
    </div>
  );
};

export default CustomInput;
