/*  src/Component/pages/OnBoarding.tsx
    – ring toujours centré, ultra-responsive                     */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import ImgWithFallback from "../common/ImageWithFallback";
import LogoBig          from "../../assets/images/logoBig.png";
import LogoBigOptimised from "../../assets/images/logoBig.webp";

import { authDataSelector } from "../../redux/reducers/userSlice";
import { useAppSelector }   from "../../redux/hooks";

/* ---------------------------------------------------------------- */
/*                   Responsive neon progress-ring                  */
/* ---------------------------------------------------------------- */
const NeonRing = ({ pct }: { pct: number }) => {
  const size   = Math.max(64, Math.min(120, window.innerWidth * 0.16));
  const stroke = 5;
  const r      = (size - stroke) / 2;
  const c      = 2 * Math.PI * r;
  const off    = c * (1 - pct / 100);

  const ang  = (pct / 100) * 360 - 90;
  const rad  = (ang * Math.PI) / 180;
  const dotX = size / 2 + r * Math.cos(rad);
  const dotY = size / 2 + r * Math.sin(rad);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="g" gradientTransform="rotate(90)">
          <stop offset="0%"   stopColor="#00ffa2" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="3.5" /></filter>
      </defs>

      <circle cx="50%" cy="50%" r={r} stroke="#553383" strokeWidth={stroke} opacity={0.35} fill="none" />
      <circle
        cx="50%" cy="50%" r={r}
        stroke="url(#g)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        fill="none" filter="url(#glow)"
      />
      <circle cx={dotX} cy={dotY} r="4" fill="#fff" />
      <circle cx={dotX} cy={dotY} r="2" fill="#605d73" />
      <text
        x="50%" y="50%" dy=".28em" textAnchor="middle"
        className="fill-white font-bold"
        style={{ fontSize: size * 0.19 }}
      >
        {pct.toFixed(0)}%
      </text>
    </svg>
  );
};

/* ---------------------------------------------------------------- */
/*                              Page                                */
/* ---------------------------------------------------------------- */
const OnBoarding: React.FC = () => {
  const [pct, setPct]      = useState(0);
  const started            = useState(() => Date.now())[0];

  const { isAuthenticated, token, refreshToken, userDetails } =
    useAppSelector(authDataSelector);
  const navigate = useNavigate();

  /* 0 → 90 % animation */
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i <= 90) setPct(i);
      if (i >= 90) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, []);

  /* auth ok → 100 % + redirect */
  useEffect(() => {
    if (!isAuthenticated || !userDetails) return;

    const delay = Math.max(0, 1500 - (Date.now() - started));
    const id = setTimeout(() => {
      setPct(100);
      localStorage.setItem("token",        token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userDetails",  JSON.stringify(userDetails));
      navigate("/bet", { replace: true });
    }, delay);

    return () => clearTimeout(id);
  }, [isAuthenticated, userDetails, token, refreshToken, navigate, started]);

  /* -------------------------------- UI ---------------------------------- */
  return (
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden relative
                    bg-gradient-to-br from-[#12001e] via-[#1d0038] to-[#090012]">

      {/* halo animé */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.3, opacity: 0.18, rotate: 45 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        className="absolute w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(0,255,185,0.45),transparent_65%)]"
      />

      {/* logo */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 w-[clamp(220px,60vw,600px)]"
        >
          <ImgWithFallback
            src={LogoBigOptimised}
            fallback={LogoBig}
            alt="Corgi in Space"
            className="w-full h-auto select-none pointer-events-none"
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      {/* ring – conteneur pleine largeur centré */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="absolute top-[74%] sm:top-[78%] w-full flex justify-center"
      >
        <NeonRing pct={pct} />
      </motion.div>
    </div>
  );
};

export default OnBoarding;
