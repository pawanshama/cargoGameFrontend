import { useEffect, useState } from "react";
import OtpInput from "../common/OtpInput";
import { CloseIcon } from "../../assets/iconset";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { refreshVerifyState, VerifyOtp } from "../../redux/actions/userActions";
import { authDataSelector } from "../../redux/reducers/userSlice";

interface EmailOtpVerifyProps {
  email: string;
  isVerify: boolean;
  setIsVerify: (value: boolean) => void;
  otpType: string;
  setIsContactVerify: (value: boolean) => void;
}

const EmailOtpVerify: React.FC<EmailOtpVerifyProps> = ({ isVerify, setIsVerify, email, otpType, setIsContactVerify }) => {
  const [otp, setOtp] = useState("");
  const dispatch = useAppDispatch();
  const { useDetailsStatus, userDetails, otpVerified, otpVerifiedError, otpVerifiedMsg } = useAppSelector(authDataSelector);

  const handleOtpChange = (newOtp: string) => {
    console.log(otp);
    setOtp(newOtp);
    console.log(newOtp);
    if (newOtp.length === 4) {
      const otpNumber = parseInt(newOtp, 10);
      dispatch(VerifyOtp({ otp: otpNumber, mail: email }));
    }
  };

  const handleClose = () => {
    setIsVerify(!isVerify);
  };
  const updateUserDetails = () => {
    if (useDetailsStatus && userDetails) {
      localStorage.removeItem("userDetails");
      console.log("localstorage", localStorage.getItem("userDetails"));
      localStorage.setItem("userDetails", userDetails);
      return true;
    }
  }

  useEffect(() => {
    console.log("otpVerified", otpVerified, "OTP", otpType);
    if (otpVerified && otpType === "both") {
      setIsVerify(false);
      dispatch(refreshVerifyState())
      setIsContactVerify(true)
    } else if (otpVerified && otpType === "email") {
      updateUserDetails();
      setIsVerify(false);
    }
  }, [otpVerified, otpVerifiedError, otpVerifiedMsg, useDetailsStatus, userDetails])

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-20 flex flex-col rounded-t-[10px] shadow-[0px_0px_100px_0px_rgba(0,,0,0.05)] backdrop-blur-[1.5625rem] bg-black/[0.6] h-[100dvh] w-full max-w-[640px]">
      <div className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={handleClose}
          className="h-[1.875rem] w-[1.875rem] bg-transparent"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 px-5">
        <h2 className="text-center text-white h1">email verification</h2>
        <p className="mt-4 text-center text-textColor subheading">
          We sent a code to your email <span className="flex flex-wrap justify-center gap-1 text-center">{email}<button type="button" onClick={handleClose} className="bg-transparent text-primary">Change</button></span>
        </p>
        <form className="mt-[1.875rem]">
          <OtpInput onChange={handleOtpChange} />
        </form>
        <p className="mt-[1.875rem] subheading text-textColor text-center">Don't receive your code? <span className="flex justify-center gap-1 text-center">Click to<button type="button" onClick={handleClose} className="bg-transparent text-primary">Resend</button>in 29 seconds</span></p>
      </div>
    </div>
  );
};

export default EmailOtpVerify;
