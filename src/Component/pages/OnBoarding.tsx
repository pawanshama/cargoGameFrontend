/* src/Component/pages/OnBoarding.tsx
   — version vérifiée : plus de redondances “Telegram”, aucun appel backend doublon */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ImgWithFallback from "../common/ImageWithFallback";
import LogoBig from "../../assets/images/logoBig.png";
import LogoBigOptimised from "../../assets/images/logoBig.webp";

import { authDataSelector } from "../../redux/reducers/userSlice";
import { useAppSelector } from "../../redux/hooks";

/* -------------------------------------------------------------------------- */
/*                              UI – Progress Bar                             */
/* -------------------------------------------------------------------------- */

interface ProgressCircleProps {
  percentage: number;
  strokeWidth?: number;
  sqSize?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  strokeWidth = 4,
  sqSize = 68,
}) => {
  const radius = (sqSize - strokeWidth) / 2;
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  /* position du “dot” */
  const angle = (percentage / 100) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const dotX = sqSize / 2 + radius * Math.cos(rad);
  const dotY = sqSize / 2 + radius * Math.sin(rad);

  return (
    <svg
      className="block m-auto"
      width={sqSize}
      height={sqSize}
      viewBox={`0 0 ${sqSize} ${sqSize}`}
    >
      <defs>
        <linearGradient id="progressGradient" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="#00FF92" />
          <stop offset="100%" stopColor="#006400" />
        </linearGradient>
      </defs>

      {/* cercle violet “ghost” */}
      <circle
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        stroke="#7848B4"
        strokeOpacity={0.5}
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* barre de progression */}
      <circle
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        stroke="url(#progressGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
      />

      {/* dot décoratif */}
      <circle cx={dotX} cy={dotY} r="3.5" fill="white" />
      <circle cx={dotX} cy={dotY} r="1.5" fill="#757279" />

      {/* texte % */}
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        className="fill-current textBold text-textColor"
      >
        {`${percentage}%`}
      </text>
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/*                                Page logic                                  */
/* -------------------------------------------------------------------------- */

const OnBoarding: React.FC = () => {
  const [percent, setPercent] = useState(0);
  const startTime = useState(() => Date.now())[0];

  const navigate = useNavigate();
  const { isAuthenticated, token, refreshToken, userDetails } =
    useAppSelector(authDataSelector);

  /* Animation barre (0 → 90 %) */
  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += 1;
      if (p <= 90) setPercent(p);
    }, 15);
    return () => clearInterval(id);
  }, []);

  /* Quand l’auth est faite → 100 % + redirection */
  useEffect(() => {
    if (!isAuthenticated || !userDetails) return;

    /* garantir mini 1.5 s d’écran */
    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, 1500 - elapsed);

    const id = setTimeout(() => {
      setPercent(100);
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      navigate("/bet", { replace: true });
    }, delay);

    return () => clearTimeout(id);
  }, [isAuthenticated, userDetails, token, refreshToken, navigate, startTime]);

  /* ---------------------------------------------------------------------- */
  /*                                Render                                  */
  /* ---------------------------------------------------------------------- */

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
