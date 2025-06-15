import React, { ReactEventHandler, useRef } from "react";

interface OtpInputProps {
  length?: number;
  onChange: (otp: string) => void;
  onBlur?: ReactEventHandler<HTMLInputElement>;
  isError?: boolean
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 4,
  onChange,
  onBlur,
  isError = false
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    console.log("valie", value);
    if (/^\d$/.test(value)) {
      const newOtp = inputsRef.current
        .map((input) => input?.value || "")
        .join("");
      onChange(newOtp);
      console.log("newOtp", newOtp);
      if (index < length - 1 && value) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !inputsRef.current[index]?.value &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <>
      <div
        className={`grid items-center justify-center gap-[.625rem] grid-cols-4`}
      >
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            name="otp"
            id={`otp${i + 1}`}
            onBlur={onBlur}
            className={`max-h-[3.875rem] max-w-[3.875rem] aspect-square rounded-lg bg-[#2D3450] flex items-center justify-center subheading text-white text-center focus:border focus:border-secondary focus-visible:outline-secondary ${isError ? 'border border-inActiveTab' : ''}`}
            ref={(el) => (inputsRef.current[i] = el)}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>
      {isError && <p className="text-inActiveTab text-center textSmall mt-3">Wrong OTP, Please enter correct OTP</p>}
    </>
  );
};

export default OtpInput;
