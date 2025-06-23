/*  src/Component/pages/OnBoarding.tsx
    – responsive neon loader (v3-final)                              */

import { useEffect, useState }          from "react";
import { useNavigate }                  from "react-router-dom";
import { motion, AnimatePresence }      from "framer-motion";

import ImgWithFallback                  from "../common/ImageWithFallback";
import LogoBig                           from "../../assets/images/logoBig.png";
import LogoBigOptimised                  from "../../assets/images/logoBig.webp";

import { authDataSelector }             from "../../redux/reducers/userSlice";
import { useAppSelector }               from "../../redux/hooks";

/* ─────────────────────────────── ring ────────────────────────────── */
const NeonRing: React.FC<{ pct: number }> = ({ pct }) => {
  /* diamètre : 18 vw (entre 72 px et 130 px) */
  const size      = Math.max(72, Math.min(130, window.innerWidth * 0.18));
  const stroke    = Math.max(5, Math.min(7, size * 0.055));      // 5-7 px
  const dotR      = Math.max(4, Math.min(6, size * 0.047));      // 4-6 px
  const r         = (size - stroke - dotR * 2 - 2) / 2;          // marge 1 px
  const c         = 2 * Math.PI * r;
  const dashOff   = c * (1 - pct / 100);

  const ang       = (pct / 100) * 360 - 90;
  const rad       = (ang * Math.PI) / 180;
  const cx        = size / 2 + r * Math.cos(rad);
  const cy        = size / 2 + r * Math.sin(rad);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} shapeRendering="geometricPrecision">
      <defs>
        <linearGradient id="g" gradientTransform="rotate(90)">
          <stop offset="0%"   stopColor="#00ffa2" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* piste */}
      <circle cx="50%" cy="50%" r={r} stroke="#4d2e7d" strokeWidth={stroke} opacity={0.3} fill="none" />

      {/* progression */}
      <circle
        cx="50%" cy="50%" r={r}
        stroke="url(#g)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={dashOff}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        fill="none" filter="url(#glow)"
      />

      {/* dot */}
      <circle cx={cx} cy={cy} r={dotR}        fill="#fff" />
      <circle cx={cx} cy={cy} r={dotR * 0.45} fill="#5f5d72" />

      {/* pourcentage */}
      <text
        x="50%" y="50%" dy=".28em" textAnchor="middle"
        className="fill-white font-bold"
        style={{ fontSize: size * 0.18 }}
      >
        {pct.toFixed(0)}%
      </text>
    </svg>
  );
};

/* ─────────────────────────────── page ────────────────────────────── */
const OnBoarding: React.FC = () => {
  const [pct, setPct] = useState(0);
  const born          = useState(() => Date.now())[0];

  const { isAuthenticated, token, refreshToken, userDetails } =
    useAppSelector(authDataSelector);
  const navigate = useNavigate();

  /* animation 0 → 90 % */
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i <= 90) setPct(i);
      if (i >= 90) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, []);

  /* passe à 100 % puis redirige */
  useEffect(() => {
    if (!isAuthenticated || !userDetails) return;
    const delay = Math.max(0, 1500 - (Date.now() - born));

    const id = setTimeout(() => {
      setPct(100);
      localStorage.setItem("token",        token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userDetails",  JSON.stringify(userDetails));
      navigate("/bet", { replace: true });
    }, delay);

    return () => clearTimeout(id);
  }, [isAuthenticated, userDetails, token, refreshToken, navigate, born]);

  /* ─────────────────────────── UI ─────────────────────────── */
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center overflow-hidden relative
                    bg-gradient-to-br from-[#12001e] via-[#1d0038] to-[#090012]">

      {/* halo animé (pointer-events none pour éviter tout focus) */}
      <motion.div
        className="absolute w-[140%] h-[140%] pointer-events-none
                   bg-[radial-gradient(circle_at_center,rgba(0,255,185,0.45),transparent_65%)]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.25, opacity: 0.17, rotate: 45 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      />

      {/* logo */}
      <AnimatePresence>
        <motion.div
          key="logo"
          className="relative z-10 w-[clamp(220px,60vw,600px)]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <ImgWithFallback
            src={LogoBigOptimised}
            fallback={LogoBig}
            alt="Corgi in Space"
            loading="eager"
            className="w-full h-auto select-none pointer-events-none"
          />
        </motion.div>
      </AnimatePresence>

      {/* anneau de chargement */}
      <motion.div
        className="w-full flex justify-center mt-[clamp(3rem,8vh,5.25rem)]"
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <NeonRing pct={pct} />
      </motion.div>
    </div>
  );
};

export default OnBoarding;
