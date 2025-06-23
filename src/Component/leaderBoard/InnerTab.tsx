import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";
import ProfilePic from "../../assets/images/dummyProfile.png";
import TopCard from "./TopCard";

/* --------------------------- types & mocks --------------------------- */
export interface InnerTabProps {
  period: "all time" | "daily" | "weekly" | "monthly";
}

// → remplace par tes vraies données
const dummyList = Array.from({ length: 50 }, (_, i) => ({
  rank: i + 1,
  amount: 1_801_991 - i * 873,
  title: i === 3 ? "amazo_777" : "Davislatimp",
  profilePic: ProfilePic,
}));

/* ---------------------------- component ------------------------------ */
const InnerTab: React.FC<InnerTabProps> = ({ period }) => {
  /* ----- constants & derived data ----- */
  const currentUserRank = 4;                          // TODO: bind à ton store/API
  const currentPlayer   = dummyList.find(u => u.rank === currentUserRank);

  const topThree = useMemo(() => dummyList.slice(0, 3), []);
  const others   = useMemo(() => dummyList.slice(3), []);

  /* ----- refs & state ----- */
  const listTopRef  = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);   // déclencheur pour le bouton
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* ----- intersection observer pour le bouton ----- */
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setShowScrollTop(!entry.isIntersecting),
      { threshold: 0.3 },
    );
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, []);

  /* ----- scroll back ----- */
  const scrollToTop = () =>
    listTopRef.current?.scrollIntoView({ behavior: "smooth" });

  /* ------------------------------- render ----------------------------- */
  return (
    <section className="relative flex w-full flex-col gap-6">
      {/* ancre top */}
      <div ref={listTopRef} />

      {/* ------------------------ podium ------------------------ */}
      <AnimatePresence>
        <motion.ol
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mx-auto grid w-full max-w-[350px] grid-cols-3 items-end gap-3"
        >
          {topThree.map(user => (
            <TopCard
              key={user.rank}
              {...user}
              isCurrentUser={user.rank === currentUserRank}
            />
          ))}
        </motion.ol>
      </AnimatePresence>

      {/* ---------------------- liste principale ---------------------- */}
      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
        {/* joueur courant si hors top3 */}
        {currentPlayer && currentPlayer.rank > 3 && (
          <TopCard
            key="me"
            {...currentPlayer}
            isCurrentUser
          />
        )}

        {others.map((user, i) => (
          <div key={user.rank} ref={i === 7 ? sentinelRef : undefined}>
            <TopCard
              {...user}
              isCurrentUser={user.rank === currentUserRank}
              isLast={i === others.length - 1}
            />
          </div>
        ))}
      </div>

      {/* --------------------- bouton retour haut --------------------- */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="up"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            aria-label="Scroll to top"
            onClick={scrollToTop}
            className="fixed bottom-[128px] right-6 z-50 rounded-full bg-gradient-to-tr from-[#22e584] to-[#2CFD95] p-3 text-black shadow-xl backdrop-blur-md active:scale-95"
          >
            <ArrowUpCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* info période (facultatif) */}
      <p className="mt-4 self-center text-xs text-white/50">{period} leaderboard</p>
    </section>
  );
};

export default InnerTab;
