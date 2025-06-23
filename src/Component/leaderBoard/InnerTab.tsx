/* ===========================================================================
   src/Component/leaderBoard/InnerTab.tsx
   👉 Version “pixel-perfect” — palettes corrigées, espacement affiné, flèche bleue
   ========================================================================== */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";
import ProfilePic from "../../assets/images/dummyProfile.png";
import TopCard from "./TopCard";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */
export interface InnerTabProps {
  period: "all time" | "daily" | "weekly" | "monthly";
}

interface Player {
  rank: number;
  title: string;
  amount: number;
  profilePic: string;
}

/* -------------------------------------------------------------------------- */
/*                                MOCK DATA                                   */
/* -------------------------------------------------------------------------- */
const mockPlayers: Player[] = Array.from({ length: 50 }, (_, i) => ({
  rank: i + 1,
  title: i === 3 ? "amazo_777" : "Davislatimp",
  amount: 1_801_991 - i * 873,
  profilePic: ProfilePic,
}));

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */
const InnerTab: React.FC<InnerTabProps> = ({ period }) => {
  const currentUserRank = 4; // TODO: replace with store / API
  const currentPlayer   = mockPlayers.find(p => p.rank === currentUserRank);

  /* découpe podium / reste */
  const [podium, others] = useMemo(() => {
    const [g, s, b, ...rest] = mockPlayers;
    return [[g, s, b], rest] as const;
  }, []);

  /* scroll-top */
  const anchor = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const [showUp, setShowUp] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => setShowUp(!e.isIntersecting),
      { threshold: 0.25 },
    );
    sentinel.current && io.observe(sentinel.current);
    return () => io.disconnect();
  }, []);

  const scrollToTop = () => anchor.current?.scrollIntoView({ behavior: "smooth" });

  /* ---------------------------------------------------------------------- */
  /*                                   UI                                   */
  /* ---------------------------------------------------------------------- */
  return (
    <section className="relative flex w-full flex-col gap-6">
      <div ref={anchor} />

      {/* ------------------------ PODIUM ------------------------ */}
      <motion.ol
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="mx-auto grid w-full max-w-[350px] grid-cols-3 items-end gap-2"
      >
        {podium.map(
          user =>
            user && (
              <TopCard
                key={user.rank}
                {...user}
                isCurrentUser={user.rank === currentUserRank}
              />
            ),
        )}
      </motion.ol>

      {/* --------------------- MAIN LIST ---------------------- */}
      <div className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-white/12 bg-white/5/25 px-4 py-3 backdrop-blur-md">
        {currentPlayer && currentPlayer.rank > 3 && (
          <TopCard {...currentPlayer} isCurrentUser />
        )}

        {others.map((u, i) => (
          <div key={u.rank} ref={i === 7 ? sentinel : undefined}>
            <TopCard
              {...u}
              isCurrentUser={u.rank === currentUserRank}
              isLast={i === others.length - 1}
            />
          </div>
        ))}
      </div>

      {/* ----------------- SCROLL UP BUTTON ----------------- */}
      <AnimatePresence>
        {showUp && (
          <motion.button
            key="up"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.22 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-[122px] right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#00e1ff]/90 backdrop-blur shadow-xl active:scale-95"
          >
            <ArrowUpCircle className="h-6 w-6 text-black/90" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* padding bas pour tab-bar */}
      <div className="h-[170px]" />

      {/* tag période */}
      <p className="pointer-events-none absolute bottom-[150px] left-1/2 -translate-x-1/2 text-[11px] font-medium tracking-wide text-white/60">
        {period} leaderboard
      </p>
    </section>
  );
};

export default InnerTab;
