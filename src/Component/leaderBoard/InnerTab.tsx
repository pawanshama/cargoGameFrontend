/* --------------------------------------------------------------------------
   src/Component/leaderBoard/InnerTab.tsx
--------------------------------------------------------------------------- */
import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";
import useSWR from "swr";
import TopCard from "./TopCard";
import ProfileFallback from "../../assets/images/dummyProfile.png";

export interface InnerTabProps {
  period: "all time" | "daily" | "weekly" | "monthly";
}

export interface Player {
  rank: number;
  username: string;
  avatar: string;
  profit: number;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

const InnerTab: React.FC<InnerTabProps> = ({ period }) => {
  /* ------------------- appel API ------------------- */
  const apiPeriod = period.replace(" ", ""); // "all time" → "alltime" -> correspond à 'all'
  const { data, error, isLoading } = useSWR<Player[]>(
    `/api/leaderboard?period=${apiPeriod}&limit=100`,
    fetcher,
    { refreshInterval: 15000 },
  );

  const players = data ?? [];

  /* découpes podium / reste */
  const [podium, others] = useMemo(() => {
    const [g, s, b, ...rest] = players;
    return [[g, s, b], rest] as const;
  }, [players]);

  /* scroll-top logic inchangé ------------------------- */
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

  /* ----------------- UI ----------------- */
  if (isLoading) {
    return <p className="text-center py-10">Loading…</p>;
  }
  if (error) {
    return <p className="text-center text-red-400 py-10">Erreur leaderboard</p>;
  }

  return (
    /* ton HTML existant, seuls TopCard changent */
    <section className="relative flex w-full flex-col gap-6">
      <div ref={anchor} />

      {/* PODIUM */}
      <motion.ol /* props identiques */
        className="mx-auto grid w-full max-w-[350px] grid-cols-3 items-end gap-2"
      >
        {podium.map(
          user =>
            user && (
              <TopCard
                key={user.rank}
                rank={user.rank}
                profilePic={user.avatar || ProfileFallback}
                title={user.username}
                amount={user.profit}
                isCurrentUser={false /* tu pourras comparer avec le user courant */}
              />
            ),
        )}
      </motion.ol>

      {/* LISTE */}
      <div className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-white/12 bg-white/5/25 px-4 py-3 backdrop-blur-md">
        {others.map((u, i) => (
          <div key={u.rank} ref={i === 7 ? sentinel : undefined}>
            <TopCard
              rank={u.rank}
              profilePic={u.avatar || ProfileFallback}
              title={u.username}
              amount={u.profit}
              isCurrentUser={false}
              isLast={i === others.length - 1}
            />
          </div>
        ))}
      </div>

      {/* bouton scroll-up inchangé */}
      <AnimatePresence>
        {showUp && (
          <motion.button /* … */ onClick={scrollToTop}>
            <ArrowUpCircle className="h-6 w-6 text-black/90" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="h-[170px]" />
      <p className="pointer-events-none absolute bottom-[150px] left-1/2 -translate-x-1/2 text-[11px] font-medium tracking-wide text-white/60">
        {period} leaderboard
      </p>
    </section>
  );
};

export default InnerTab;
