/* ===========================================================================
   src/Component/leaderBoard/InnerTab.tsx
   ⬇️ Copie-colle intégralement ce fichier – prêt à l’emploi
   ========================================================================== */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";
import ProfilePic from "../../assets/images/dummyProfile.png";
import TopCard from "./TopCard";

/* -------------------------------------------------------------------------- */
/*                               TYPES & MOCKS                                */
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

/* → remplace mockPlayers par tes données backend */
const mockPlayers: Player[] = Array.from({ length: 50 }, (_, i) => ({
  rank: i + 1,
  title: i === 3 ? "amazo_777" : "Davislatimp",
  amount: 1_801_991 - i * 873,
  profilePic: ProfilePic,
}));

/* -------------------------------------------------------------------------- */
/*                                   COMPONENT                                */
/* -------------------------------------------------------------------------- */
const InnerTab: React.FC<InnerTabProps> = ({ period }) => {
  /* ----- CONSTANTS ----- */
  const currentUserRank = 4;                           // TODO: bind store/API
  const currentPlayer   = mockPlayers.find(p => p.rank === currentUserRank);

  /* ----- SPLIT DATA ----- */
  const [podium, others] = useMemo(() => {
    const [first, second, third, ...rest] = mockPlayers;
    return [[first, second, third], rest] as const;
  }, []);

  /* ----- SCROLL-UP LOGIC ----- */
  const anchorRef   = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [showUp,    setShowUp] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setShowUp(!entry.isIntersecting),
      { threshold: 0.2 },
    );
    sentinelRef.current && io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, []);

  const scrollToTop = () =>
    anchorRef.current?.scrollIntoView({ behavior: "smooth" });

  /* ---------------------------------------------------------------------- */
  /*                                   RENDER                               */
  /* ---------------------------------------------------------------------- */
  return (
    <section className="relative flex w-full flex-col gap-6">
      {/* anchor haut de liste */}
      <div ref={anchorRef} />

      {/* ------------------------- PODIUM ------------------------- */}
      <motion.ol
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="mx-auto grid w-full max-w-[350px] grid-cols-3 items-end gap-3"
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

      {/* --------------------- MAIN LIST --------------------- */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/5/30 backdrop-blur-md px-4 py-3">
        {/* current user highlight (if not podium) */}
        {currentPlayer && currentPlayer.rank > 3 && (
          <TopCard key="me" {...currentPlayer} isCurrentUser />
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

      {/* ------------------ SCROLL-TO-TOP BTN ------------------ */}
      <AnimatePresence>
        {showUp && (
          <motion.button
            key="scrollUp"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-[120px] right-6 z-50 rounded-full bg-gradient-to-tr from-[#22e584] to-[#2CFD95] p-3 text-black shadow-xl backdrop-blur-md active:scale-95"
          >
            <ArrowUpCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* footer padding pour TabBar Telegram */}
      <div className="h-[180px]" />

      {/* période info (facultatif) */}
      <p className="absolute bottom-[140px] left-1/2 -translate-x-1/2 text-[11px] font-medium tracking-wide text-white/60">
        {period} leaderboard
      </p>
    </section>
  );
};

export default InnerTab;
