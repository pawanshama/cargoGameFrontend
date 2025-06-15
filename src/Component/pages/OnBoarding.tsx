import { useEffect, useState } from "react";
import LogoBig from "../../assets/images/logoBig.png";
import LogoBigOptimised from "../../assets/images/logoBig.webp";
import { authDataSelector } from "../../redux/reducers/userSlice";
import { useNavigate } from "react-router-dom";
import ImgWithFallback from "../common/ImageWithFallback";
import { useAppSelector } from "../../redux/hooks";

declare global {
  interface Window {
    Telegram?: any;
  }
}

interface ProgressProps {
  percentage: number;
}

interface ProgressCircleProps extends ProgressProps {
  strokeWidth?: number;
  sqSize?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  strokeWidth = 4,
  sqSize = 68,
  percentage,
}) => {
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  const angle = (percentage / 100) * 360;
  const radian = (angle - 90) * (Math.PI / 180); // Adjusting by 90 degrees to start from top center
  const dotRadius = strokeWidth / 2;
  const adjustedRadius = radius - dotRadius; // Adjust radius to keep dot inside the circle
  const dotX = sqSize / 2 + adjustedRadius * Math.cos(radian);
  const dotY = sqSize / 2 + adjustedRadius * Math.sin(radian);

  return (
    <div>
      <svg
        className="block m-auto"
        width={sqSize}
        height={sqSize}
        viewBox={viewBox}
      >
        <defs>
          <linearGradient id="progressGradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="#00FF92" />
            <stop offset="100%" stopColor="#006400" />
          </linearGradient>
        </defs>
        <path
          d="M64 33.5C64 37.571 63.1982 41.6021 61.6403 45.3632C60.0824 49.1243 57.7989 52.5417 54.9203 55.4203C52.0417 58.2989 48.6243 60.5824 44.8632 62.1403C41.1021 63.6982 37.071 64.5 33 64.5C28.929 64.5 24.8979 63.6982 21.1368 62.1403C17.3757 60.5824 13.9583 58.2989 11.0797 55.4203C8.20107 52.5417 5.91763 49.1243 4.35973 45.3632C2.80184 41.6021 2 37.571 2 33.5C2 29.429 2.80184 25.3979 4.35974 21.6368C5.91764 17.8757 8.20108 14.4583 11.0797 11.5797C13.9583 8.70107 17.3757 6.41762 21.1368 4.85973C24.8979 3.30183 28.929 2.5 33 2.5C37.071 2.5 41.1021 3.30184 44.8632 4.85974C48.6243 6.41764 52.0417 8.70108 54.9203 11.5797C57.7989 14.4583 60.0824 17.8757 61.6403 21.6368C63.1982 25.3979 64 29.429 64 33.5L64 33.5Z"
          stroke="#7848B4"
          strokeOpacity="0.5"
          strokeWidth="3.95745"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle
          cx={sqSize / 2}
          cy={sqSize / 2 - 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          transform="rotate(-90, 34, 34)"
        />
        <circle cx={dotX} cy={dotY} r="3.5" fill="white" />
        <circle cx={dotX} cy={dotY} r="1.5" fill="#757279" />
        <text
          className="z-10 fill-current textBold text-textColor"
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
        >
          {`${percentage}%`}
        </text>
      </svg>
    </div>
  );
};

const OnBoarding = () => {
  const [percent] = useState(25);
  const navigate = useNavigate();
  const { isAuthenticated, token, refreshToken, userDetails } = useAppSelector(authDataSelector);

  useEffect(() => {
  const initTelegram = async () => {
    const { WebApp } = window.Telegram;
    WebApp.ready();
    console.log("✅ Telegram ready, InitData:", WebApp.initData);

    // Tu peux traiter WebApp.initData ici si besoin
  };

  if (window.Telegram) {
    initTelegram();
  } else {
    console.error("Telegram WebApp is not disponible");
  }
}, []);

  useEffect(() => {
    localStorage.clear();
    if (isAuthenticated && userDetails) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userDetails", userDetails);
      navigate("/bet");
    }
  }, [isAuthenticated, userDetails]);

  return (
    <div className="w-full h-[100dvh] relative flex flex-col items-center justify-center">
      <ImgWithFallback
        src={LogoBigOptimised}
        fallback={LogoBig}
        alt="Logo"
        loading="lazy"
        className="max-w-[640px] w-full object-contain"
      />
      <div className="absolute z-10 flex items-center justify-center -translate-x-1/2 -translate-y-6 left-1/2 top-3/4">
        <ProgressCircle percentage={percent} />
      </div>
    </div>
  );
};

export default OnBoarding;
