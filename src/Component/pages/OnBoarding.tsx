/*  src/Component/pages/OnBoarding.tsx
    – Glow / Glass • Framer-motion • Aucune requête réseau      */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import ImgWithFallback from "../common/ImageWithFallback";
import LogoBig          from "../../assets/images/logoBig.png";
import LogoBigOptimised from "../../assets/images/logoBig.webp";

import { authDataSelector } from "../../redux/reducers/userSlice";
import { useAppSelector }   from "../../redux/hooks";

/* ------------------------------------------------------------------ */
/*                       PROGRESS NEON RING (svg)                     */
/* ------------------------------------------------------------------ */

interface RingProps { pct: number }

const NeonRing: React.FC<RingProps> = ({ pct }) => {
  const size = 88;                 // ↔ px
  const stroke = 5;
  const r  = (size - stroke) / 2;
  const c  = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);

  /* position du dot */
  const a   = (pct / 100) * 360 - 90;
  const rad = (a * Math.PI) / 180;
  const cx  = size / 2 + r * Math.cos(rad);
  const cy  = size / 2 + r * Math.sin(rad);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="g" gradientTransform="rotate(90)">
          <stop offset="0%"  stopColor="#00ffa2" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="colored" />
          <feMerge>
            <feMergeNode in="colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#553383"
        strokeWidth={stroke}
        opacity={0.35}
        fill="none"
      />

      {/* progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="url(#g)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        fill="none"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        filter="url(#glow)"
      />

      {/* dot */}
      <circle cx={cx} cy={cy} r={4} fill="#fff" />
      <circle cx={cx} cy={cy} r={2} fill="#5c5a6d" />

      {/* % */}
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        className="fill-white font-bold"
        style={{ fontSize: 16 }}
      >
        {pct.toFixed(0)}%
      </text>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*                              PAGE LOGIC                            */
/* ------------------------------------------------------------------ */

const OnBoarding: React.FC = () => {
  const [pct, setPct] = useState(0);
  const started       = useState(() => Date.now())[0];

  const { isAuthenticated, token, refreshToken, userDetails } =
    useAppSelector(authDataSelector);

  const navigate = useNavigate();

  /* 1️⃣ simple barre 0→90 % */
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i <= 90) setPct(i);
      if (i >= 90) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, []);

  /* 2️⃣ quand auth OK → 100 % puis redir. */
  useEffect(() => {
    if (!isAuthenticated || !userDetails) return;

    const elapsed = Date.now() - started;
    const delay   = Math.max(0, 1500 - elapsed);

    const id = setTimeout(() => {
      setPct(100);
      localStorage.setItem("token",         token);
      localStorage.setItem("refreshToken",  refreshToken);
      localStorage.setItem("userDetails",   JSON.stringify(userDetails));
      navigate("/bet", { replace: true });
    }, delay);

    return () => clearTimeout(id);
  }, [isAuthenticated, userDetails, token, refreshToken, navigate, started]);

  /* ---------------------------------------------------------------- */
  /*                               UI                                 */
  /* ---------------------------------------------------------------- */

  return (
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#12001e] via-[#1d0038] to-[#090012]">
      {/* arrière-plan néon animé */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.25, opacity: 0.15, rotate: 45 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        className="absolute w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(0,255,185,0.4),transparent_60%)]"
      />

      {/* Logo */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-[580px] w-[75%]"
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

      {/* Ring loader */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute left-1/2 top-[73%] -translate-x-1/2"
      >
        <NeonRing pct={pct} />
      </motion.div>
    </div>
  );
};

export default OnBoarding;
