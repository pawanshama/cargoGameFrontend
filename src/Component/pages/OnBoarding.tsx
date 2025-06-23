/*  src/Component/pages/OnBoarding.tsx
    – slim neon ring, never clipped, elegant                         */

import { useEffect, useState }               from "react";
import { useNavigate }                       from "react-router-dom";
import { motion, AnimatePresence }           from "framer-motion";

import ImgWithFallback                       from "../common/ImageWithFallback";
import LogoBig                               from "../../assets/images/logoBig.png";
import LogoBigOptimised                      from "../../assets/images/logoBig.webp";

import { authDataSelector }                  from "../../redux/reducers/userSlice";
import { useAppSelector }                    from "../../redux/hooks";

/* ------------------------------------------------------------------ */
/*                       Slim, never-clipped progress ring            */
/* ------------------------------------------------------------------ */
const NeonRing = ({ pct }: { pct: number }) => {
  /* size : 16 vw — min 64 / max 120 px */
  const size      = Math.max(64, Math.min(120, window.innerWidth * 0.16));
  const stroke    = Math.max(3, size * 0.035);           // 3 – 4.2 px
  const dotR      = Math.max(2.5, size * 0.04);          // 2.6 – 4.8 px
  const r         = (size - stroke - dotR * 2 - 2) / 2;  // always padding
  const c         = 2 * Math.PI * r;
  const dashOff   = c * (1 - pct / 100);

  const ang       = (pct / 100) * 360 - 90;
  const rad       = (ang * Math.PI) / 180;
  const dotX      = size / 2 + r * Math.cos(rad);
  const dotY      = size / 2 + r * Math.sin(rad);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id="ringGrad" gradientTransform="rotate(90)">
          <stop offset="0%"   stopColor="#00ffa2" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
      </defs>

      {/* track */}
      <circle
        cx="50%" cy="50%" r={r}
        stroke="#543080" strokeWidth={stroke} opacity="0.25" fill="none"
      />

      {/* progress */}
      <circle
        cx="50%" cy="50%" r={r}
        stroke="url(#ringGrad)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={dashOff}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        fill="none"
      />

      {/* dot */}
      <circle cx={dotX} cy={dotY} r={dotR}  fill="#ffffff" />
      <circle cx={dotX} cy={dotY} r={dotR * 0.5} fill="#5e5b70" />

      {/* percentage */}
      <text
        x="50%" y="50%" dy=".32em" textAnchor="middle"
        className="fill-white font-bold"
        style={{ fontSize: size * 0.18 }}
      >
        {pct.toFixed(0)}%
      </text>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*                              Page                                   */
/* ------------------------------------------------------------------ */
const OnBoarding: React.FC = () => {
  const [pct, setPct]   = useState(0);
  const start           = useState(() => Date.now())[0];

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

  /* auth OK → 100 % then redirect */
  useEffect(() => {
    if (!isAuthenticated || !userDetails) return;
    const delay = Math.max(0, 1500 - (Date.now() - start));
    const id = setTimeout(() => {
      setPct(100);
      localStorage.setItem("token",        token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userDetails",  JSON.stringify(userDetails));
      navigate("/bet", { replace: true });
    }, delay);
    return () => clearTimeout(id);
  }, [isAuthenticated, userDetails, token, refreshToken, navigate, start]);

  /* ---------------------------------- UI -------------------------------- */
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center
                    bg-gradient-to-br from-[#12001e] via-[#1d0038] to-[#090012]
                    overflow-hidden relative">

      {/* soft halo */}
      <motion.div
        initial={{ scale: .8, opacity: 0 }}
        animate={{ scale: 1.25, opacity: .17, rotate: 45 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        className="absolute w-[140%] h-[140%]
                   bg-[radial-gradient(circle_at_center,rgba(0,255,185,0.45),transparent_65%)]"
      />

      {/* logo */}
      <AnimatePresence>
        <motion.div
          key="logo"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 w-[clamp(220px,60vw,600px)]"
        >
          <ImgWithFallback
            src={LogoBigOptimised}
            fallback={LogoBig}
            alt="Corgi in Space"
            className="w-full h-auto pointer-events-none select-none"
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      {/* ring – perfectly centred & responsive margin */}
      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: .25 }}
        className="w-full flex justify-center
                   mt-[clamp(2.75rem,7.5vh,5rem)]"
      >
        <NeonRing pct={pct} />
      </motion.div>
    </div>
  );
};

export default OnBoarding;
