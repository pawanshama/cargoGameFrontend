/* --------------------------------------------------------------------------
   src/Component/leaderBoard/InnerTab.tsx
   -------------------------------------------------------------------------- */

import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";
import useSWR from "swr";

import TopCard from "./TopCard";
import ProfileFallback from "../../assets/images/dummyProfile.png";
import { useAuthStore } from "@/store/authStore";

/* ------------------------------------------------------------------- */
/* Types                                                                */
/* ------------------------------------------------------------------- */
export interface InnerTabProps {
  period: "all time" | "daily" | "weekly" | "monthly";
}
export interface Player {
  rank: number;
  username: string;
  avatar: string;
  profit: number;
}

/* ------------------------------------------------------------------- */
/* Config                                                               */
/* ------------------------------------------------------------------- */
const API_BASE = import.meta.env.VITE_BACKEND_URL || ""; // ← ton env (.env)

/* fetcher sécurisé : lève une erreur si !200 ------------------------- */
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/* ------------------------------------------------------------------- */
/* Composant                                                            */
/* ------------------------------------------------------------------- */
const InnerTab: React.FC<InnerTabProps> = ({ period }) => {
  const currentUsername = useAuthStore((s) => s.username);

  /* ---------- appel API ---------- */
  const apiPeriod =
    period === "all time" ? "all" : period; // mapping correct
  const { data, error, isLoading } = useSWR<Player[]>(
    `${API_BASE}/api/leaderboard?period=${apiPeriod}&limit=100`,
    fetcher,
    { refreshInterval: 15000 },
  );

  const players = Array.isArray(data) ? data : [];

  /* ---------- découpe podium / others ---------- */
  const [podium, others] = useMemo(() => {
    const g = players[0], s = players[1], b = players[2];
    return [[g, s, b], players.slice(3)] as const;
  }, [players]);

  /* ---------- scroll-to-top logic ---------- */
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

  /* ---------- états réseau ---------- */
  if (isLoading) return <p className="text-center py-10">Loading…</p>;
  if (error)     return <p className="text-center text-red-400 py-10">Erreur leaderboard</p>;

  /* ---------- UI ---------- */
  return (
    <section className="relative flex w-full flex-col gap-6">
      <div ref={anchor} />

      {/* ------------------ PODIUM ------------------ */}
      <motion.ol
        className="mx-auto grid w-full max-w-[350px] grid-cols-3 items-end gap-2"
      >
        {podium.map(
          (u) =>
            u && (
              <TopCard
                key={u.rank}
                rank={u.rank}
                profilePic={u.avatar || ProfileFallback}
                title={u.username}
                amount={u.profit}
                isCurrentUser={u.username === currentUsername}
              />
            ),
        )}
      </motion.ol>

      {/* ------------------ LISTE ------------------ */}
      <div className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-white/12 bg-white/5/25 px-4 py-3 backdrop-blur-md">
        {others.map((u, i) => (
          <div key={u.rank} ref={i === 7 ? sentinel : undefined}>
            <TopCard
              rank={u.rank}
              profilePic={u.avatar || ProfileFallback}
              title={u.username}
              amount={u.profit}
              isCurrentUser={u.username === currentUsername}
              isLast={i === others.length - 1}
            />
          </div>
        ))}
      </div>

      {/* ---------------- scroll-up btn ------------- */}
      <AnimatePresence>
        {showUp && (
          <motion.button
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

      <div className="h-[170px]" />

      <p className="pointer-events-none absolute bottom-[150px] left-1/2 -translate-x-1/2 text-[11px] font-medium tracking-wide text-white/60">
        {period} leaderboard
      </p>
    </section>
  );
};

export default InnerTab;
