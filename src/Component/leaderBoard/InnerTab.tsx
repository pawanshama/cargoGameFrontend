/* ===========================================================================
   src/Component/leaderBoard/InnerTab.tsx
   Version “studio-grade” : code épuré, typage strict, animations fluides
   ========================================================================== */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";
import ProfilePic from "../../assets/images/dummyProfile.png";
import TopCard from "./TopCard";

/* ------------------------------------------------------------------ */
/*                               Types                                */
/* ------------------------------------------------------------------ */
export interface InnerTabProps {
  period: "all time" | "daily" | "weekly" | "monthly";
}

/* ------------------------------------------------------------------ */
/*                       Mock / replace with API                      */
/* ------------------------------------------------------------------ */
interface Player {
  rank: number;
  title: string;
  amount: number;
  profilePic: string;
}

const mockPlayers: Player[] = Array.from({ length: 50 }, (_, i) => ({
  rank: i + 1,
  amount: 1_801_991 - i * 873,
  title: i === 3 ? "amazo_777" : "Davislatimp",
  profilePic: ProfilePic,
}));

/* ------------------------------------------------------------------ */
/*                             Component                              */
/* ------------------------------------------------------------------ */
const InnerTab: React.FC<InnerTabProps> = ({ period }) => {
  /* --------------- constants & derived data --------------- */
  const currentUserRank = 4;                            // todo: store / API
  const currentPlayer   = mockPlayers.find(p => p.rank === currentUserRank);

  const [topThree, others] = useMemo(() => {
    const [first, second, third, ...rest] = mockPlayers;
    return [[first, second, third], rest] as const;
  }, []);

  /* ----------------------- refs & state -------------------- */
  const topAnchorRef   = useRef<HTMLDivElement>(null);
  const sentinelRef    = useRef<HTMLDivElement>(null);
  const [showScrollUp, setShowScrollUp] = useState(false);

  /* ----------------- intersection observer ---------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowScrollUp(!entry.isIntersecting),
      { threshold: 0.2 },
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---------------------- handlers ------------------------ */
  const scrollToTop = () =>
    topAnchorRef.current?.scrollIntoView({ behavior: "smooth" });

  /* ------------------------ render ------------------------ */
  return (
    <section className="relative flex w-full flex-col gap-6">
      {/* anchor */}
      <div ref={topAnchorRef} />

      {/* ================== PODIUM ================== */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.ol
          layout
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto grid w-full max-w-[350px] grid-cols-3 items-end gap-3"
        >
          {topThree.map(
            (user) =>
              user && (
                <TopCard
                  key={user.rank}
                  {...user}
                  isCurrentUser={user.rank === currentUserRank}
                />
              ),
          )}
        </motion.ol>
      </AnimatePresence>

      {/* ================ MAIN LIST ================= */}
      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
        {/* highlight current user if not in podium */}
        {currentPlayer && currentPlayer.rank > 3 && (
          <TopCard key="current" {...currentPlayer} isCurrentUser />
        )}

        {others.map((user, idx) => (
          <div key={user.rank} ref={idx === 7 ? sentinelRef : undefined}>
            <TopCard
              {...user}
              isCurrentUser={user.rank === currentUserRank}
              isLast={idx === others.length - 1}
            />
          </div>
        ))}
      </div>

      {/* ============== FLOATING SCROLL-UP ============== */}
      <AnimatePresence>
        {showScrollUp && (
          <motion.button
            key="up"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-[128px] right-6 z-50 rounded-full bg-gradient-to-tr from-[#22e584] to-[#2CFD95] p-3 text-black shadow-xl backdrop-blur-md active:scale-95"
          >
            <ArrowUpCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* period info (optional) */}
      <p className="mt-4 self-center text-xs text-white/60 tracking-wide">
        {period} leaderboard
      </p>
    </section>
  );
};

export default InnerTab;
