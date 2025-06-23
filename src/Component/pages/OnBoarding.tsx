/*  src/Component/pages/OnBoarding.tsx
    – ring toujours net / centré • ultra-responsive • framer-motion */

import { useEffect, useState }               from "react";
import { useNavigate }                       from "react-router-dom";
import { motion, AnimatePresence }           from "framer-motion";

import ImgWithFallback                       from "../common/ImageWithFallback";
import LogoBig                               from "../../assets/images/logoBig.png";
import LogoBigOptimised                      from "../../assets/images/logoBig.webp";

import { authDataSelector }                  from "../../redux/reducers/userSlice";
import { useAppSelector }                    from "../../redux/hooks";

/* ------------------------------------------------------------------ */
/*                     Neon progress-ring (SVG responsive)            */
/* ------------------------------------------------------------------ */
const NeonRing = ({ pct }: { pct: number }) => {
  /* largeur = 16 vw (64 – 120 px)                                             */
  const size   = Math.max(64, Math.min(120, window.innerWidth * 0.16));
  const dpr    = window.devicePixelRatio || 1;          // trait net sur Retina
  const stroke = 5 * dpr;                               // ↗︎ épaissit proportionnel
  const r      = (size - stroke) / 2;
  const c      = 2 * Math.PI * r;
  const off    = c * (1 - pct / 100);

  /* dot                                                                    */
  const ang  = (pct / 100) * 360 - 90;
  const rad  = (ang * Math.PI) / 180;
  const dotX = size / 2 + r * Math.cos(rad);
  const dotY = size / 2 + r * Math.sin(rad);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id="g" gradientTransform="rotate(90)">
          <stop offset="0%"   stopColor="#00ffa2" />
          <stop offset="100%" stopColor="#0066ff" />
        </linearGradient>
      </defs>

      {/* piste */}
      <circle
        cx="50%" cy="50%" r={r}
        stroke="#553383" strokeWidth={stroke} opacity=".32" fill="none"
      />

      {/* progression */}
      <circle
        cx="50%" cy="50%" r={r}
        stroke="url(#g)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        fill="none"
      />

      {/* dot */}
      <circle cx={dotX} cy={dotY} r={4 * dpr} fill="#ffffff" />
      <circle cx={dotX} cy={dotY} r={2 * dpr} fill="#5f5d72" />

      {/* % texte */}
      <text
        x="50%" y="50%" dy=".3em" textAnchor="middle"
        className="fill-white font-extrabold"
        style={{ fontSize: size * 0.19 }}
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

  /* barre 0 → 90 % ------------------------------------------------------ */
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i <= 90) setPct(i);
      if (i >= 90) clearInterval(id);
    }, 16);                                     // ~60 fps
    return () => clearInterval(id);
  }, []);

  /* auth OK → 100 % puis redirection ------------------------------------ */
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

  /* ------------------------------ UI ----------------------------------- */
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center
                    overflow-hidden relative
                    bg-gradient-to-br from-[#12001e] via-[#1d0038] to-[#090012]">

      {/* halo animé */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.3, opacity: 0.18, rotate: 45 }}
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
            className="w-full h-auto select-none pointer-events-none"
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      {/* ring */}
      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="w-full flex justify-center
                   mt-[clamp(2.75rem,7vh,4.75rem)]"
      >
        <NeonRing pct={pct} />
      </motion.div>
    </div>
  );
};

export default OnBoarding;
