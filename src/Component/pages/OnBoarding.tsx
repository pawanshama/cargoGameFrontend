/*  src/Component/pages/OnBoarding.tsx
    – ring parfaitement aligné sous le logo                        */

import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useNavigate }             from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


import LogoBig            from "../../assets/images/logoBig.png";
import LogoBigOptimised   from "../../assets/images/logoBig.webp";

import { authDataSelector } from "../../redux/reducers/userSlice";
import { useAppSelector }   from "../../redux/hooks";

/* ───────────────────── Hook : mesure du logo ──────────────────── */
const useLogoDims = () => {
  const ref = useRef<HTMLImageElement | null>(null);
  const [h, setH] = useState<number>(0);

  useLayoutEffect(() => {
    const img = ref.current;
    if (!img) return;

    const compute = () => setH(img.offsetHeight);
    if (img.complete) compute();
    else img.addEventListener("load", compute, { once: true });

    // resize observer pour zoom / rotation
    const ro = new ResizeObserver(compute);
    ro.observe(img);

    return () => ro.disconnect();
  }, []);

  return { ref, height: h };
};

/* ───────────────────── Ring responsive ────────────────────────── */
const NeonRing = ({ pct, size }: { pct: number; size: number }) => {
  const stroke = 5;
  const r   = (size - stroke) / 2;
  const c   = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);

  const ang   = (pct / 100) * 360 - 90;
  const rad   = (ang * Math.PI) / 180;
  const dotX  = size / 2 + r * Math.cos(rad);
  const dotY  = size / 2 + r * Math.sin(rad);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="g" gradientTransform="rotate(90)">
          <stop offset="0%"   stopColor="#00ffa2" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="c" />
          <feMerge>
            <feMergeNode in="c" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="50%" cy="50%" r={r} stroke="#553383" strokeWidth={stroke}
              opacity={0.35} fill="none" />
      <circle cx="50%" cy="50%" r={r}
              stroke="url(#g)" strokeWidth={stroke} strokeLinecap="round"
              strokeDasharray={c} strokeDashoffset={off}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              fill="none" filter="url(#glow)" />

      <circle cx={dotX} cy={dotY} r="4" fill="#fff" />
      <circle cx={dotX} cy={dotY} r="2" fill="#605d73" />

      <text x="50%" y="50%" dy=".28em" textAnchor="middle"
            className="fill-white font-bold"
            style={{ fontSize: size * 0.19 }}>
        {pct.toFixed(0)}%
      </text>
    </svg>
  );
};

/* ───────────────────── Page ───────────────────────────────────── */
const OnBoarding: React.FC = () => {
  const [pct, setPct]  = useState(0);
  const started        = useState(() => Date.now())[0];

  const { isAuthenticated, token, refreshToken, userDetails } =
    useAppSelector(authDataSelector);
  const navigate = useNavigate();

  /* ring diameter */
  const ringSize = Math.max(64, Math.min(120, window.innerWidth * 0.16));

  /* logo dims */
  const { ref: logoRef, height: logoH } = useLogoDims();
  const GAP = 28;                       // px entre logo & ring

  /* 0 → 90 % */
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i <= 90) setPct(i);
      if (i >= 90) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, []);

  /* 100 % + redirect */
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

  /* ───────────────────── UI ───────────────────── */
  return (
    <div className="w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden relative
                    bg-gradient-to-br from-[#12001e] via-[#1d0038] to-[#090012]">

      {/* halo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.35, opacity: 0.18, rotate: 45 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        className="absolute w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(0,255,185,0.45),transparent_65%)]" />

      {/* logo */}
      <AnimatePresence>
        <motion.img
          ref={logoRef}
          key="logo"
          src={LogoBigOptimised}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = LogoBig; }}
          alt="Corgi in Space"
          className="relative z-10 w-[clamp(220px,60vw,600px)] select-none pointer-events-none"
          initial={{ y: 35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </AnimatePresence>

      {/* ring */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{ position: "absolute", top: logoH + GAP, left: "50%", translateX: "-50%" }}
      >
        <NeonRing pct={pct} size={ringSize} />
      </motion.div>
    </div>
  );
};

export default OnBoarding;
