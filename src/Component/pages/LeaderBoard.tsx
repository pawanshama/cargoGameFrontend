import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import HorizontalTabs from "../common/Tabs";
import Footer from "../includes/Footer";
import Header from "../includes/Header";
import InnerTab, { InnerTabProps } from "../leaderBoard/InnerTab";

/* ------------------------------------------------------------------ */
/*  Définition des onglets + période associée                         */
/* ------------------------------------------------------------------ */
type Period = InnerTabProps["period"]; // "all time" | "daily" | ...

interface Tab {
  label: string;
  index: number;
  period: Period;
}

const tabs: Tab[] = [
  { label: "All Time", index: 0, period: "all time" },
  { label: "Daily",    index: 1, period: "daily"    },
  { label: "Weekly",   index: 2, period: "weekly"   },
  { label: "Monthly",  index: 3, period: "monthly"  },
];

/* ------------------------------------------------------------------ */
/*                        Composant principal                         */
/* ------------------------------------------------------------------ */
const LeaderBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    /* ---------- ROOT : full-height flex ---------- */
    <div className="relative flex h-[100dvh] flex-col bg-gradient-to-b from-[#160028] via-[#1d0934] to-[#2b1048] font-lato text-white">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-28 h-[28rem] w-[28rem] rounded-full bg-[#6443ff]/40 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] h-[26rem] w-[26rem] rounded-full bg-[#00e1ff]/40 blur-[120px]" />

      {/* ---------- HEADER ---------- */}
      <Header
        pageHeading={
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-[#00e1ff] drop-shadow-[0_0_6px_rgba(0,225,255,0.8)]" />
            <span>Leaderboard</span>
          </div>
        }
      />

      {/* ---------- CONTENT ---------- */}
      <div className="flex-1 overflow-hidden">
        {/* Sticky tabs */}
        <div className="sticky top-0 z-10 bg-[#1d0934]/60 backdrop-blur-lg">
          <HorizontalTabs
            tabs={tabs}                     // Tab[] mutables => pas d'erreur readonly
            activeTab={activeTab}
            onTabClick={setActiveTab}
            light
          />
        </div>

        {/* Panels */}
        <div className="h-full overflow-y-auto px-4 pb-28 pt-4 snap-y snap-mandatory">
          <AnimatePresence mode="wait">
            {tabs.map((t) =>
              activeTab === t.index ? (
                <motion.section
                  key={t.index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                  className="snap-start"
                >
                  {/* period est correctement typé => plus d'erreur */}
                  <InnerTab period={t.period} />
                </motion.section>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ---------- FOOTER ---------- */}
      <Footer />
    </div>
  );
};

export default LeaderBoard;
