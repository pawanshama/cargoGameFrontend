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
  const radian = (angle - 90) * (Math.PI / 180);
  const dotRadius = strokeWidth / 2;
  const adjustedRadius = radius - dotRadius;
  const dotX = sqSize / 2 + adjustedRadius * Math.cos(radian);
  const dotY = sqSize / 2 + adjustedRadius * Math.sin(radian);

  return (
    <div>
      <svg className="block m-auto" width={sqSize} height={sqSize} viewBox={viewBox}>
        <defs>
          <linearGradient id="progressGradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="#00FF92" />
            <stop offset="100%" stopColor="#006400" />
          </linearGradient>
        </defs>
        <path
          d="M64 33.5C64 37.571 ... 64 33.5Z"
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
        <text className="z-10 fill-current textBold text-textColor" x="50%" y="50%" dy=".3em" textAnchor="middle">
          {`${percentage}%`}
        </text>
      </svg>
    </div>
  );
};

const OnBoarding = () => {
  const [percent, setPercent] = useState(0);
  const [startTime] = useState(Date.now());
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, token, refreshToken, userDetails } = useAppSelector(authDataSelector);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      if (progress <= 90) setPercent(progress);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ready = isAuthenticated && userDetails;
    if (!ready) return;

    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, 1500 - elapsed);

    setTimeout(() => {
      setPercent(100);
      localStorage.clear();
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userDetails", userDetails);
      navigate("/bet");
    }, delay);
  }, [isAuthenticated, userDetails]);

  // 🔍 Récupère le code d’invitation depuis l’URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteParam = params.get("startapp");
    if (inviteParam?.startsWith("invite=")) {
      const code = inviteParam.split("=")[1];
      setInviteCode(code); // Sauvegarde du code d'invitation
      localStorage.setItem("inviteCode", code); // ✅ stocke dans localStorage
      console.log("✅ Invite code extrait et stocké :", code);
    }
  }, []);

  // 📲 Init Telegram + appel backend avec l'inviteCode
  useEffect(() => {
    const initTelegram = async () => {
      const { WebApp } = window.Telegram;
      WebApp.ready();
      console.log("✅ Telegram ready, InitData:", WebApp.initData);

      // Appel API avec les données Telegram et l'inviteCode
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/create-or-find`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-init-data": WebApp.initData, // Important !
          },
          body: JSON.stringify({
            inviteCode: inviteCode, // Envoie du code d'invitation
          }),
        });

        const data = await response.json();
        console.log("✅ Utilisateur connecté avec parrainage :", data);
      } catch (error) {
        console.error("❌ Erreur envoi inviteCode :", error);
      }
    };

    if (window.Telegram && inviteCode) {
      initTelegram(); // Appel API avec Telegram et inviteCode
    }
  }, [inviteCode]); // Le hook se déclenche dès que inviteCode est disponible

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
