/* ---------------------------------------------------------------------------
   src/Component/pages/LeaderBoard.tsx
   Ultra-pro redesign ✨
   --------------------------------------------------------------------------- */

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

import HorizontalTabs from "../common/Tabs";
import Footer  from "../includes/Footer";
import Header  from "../includes/Header";
import InnerTab, { InnerTabProps } from "../leaderBoard/InnerTab";

/* ----------------------------- tabs config ----------------------------- */
type Period = InnerTabProps["period"];

interface Tab { label: string; index: number; period: Period }

const tabs: Tab[] = [
  { label: "All Time", index: 0, period: "all time" },
  { label: "Daily",    index: 1, period: "daily"    },
  { label: "Weekly",   index: 2, period: "weekly"   },
  { label: "Monthly",  index: 3, period: "monthly"  },
];

/* -------------------------- helper components ------------------------- */
const DecorativeBlobs = memo(() => (
  <>
    <div className="pointer-events-none absolute -top-32 -left-28 h-[30rem] w-[30rem] rounded-full bg-[#6443ff]/50 blur-[160px]" />
    <div className="pointer-events-none absolute bottom-[-10rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[#00e1ff]/50 blur-[140px]" />
  </>
));

/* ----------------------------- main page ------------------------------ */
const LeaderBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative flex h-[100dvh] flex-col font-lato text-white bg-gradient-to-b from-[#160028] via-[#1d0934] to-[#2b1048]">
      {/* --- background blurs --- */}
      <DecorativeBlobs />

      {/* --- header --- */}
      <Header
        pageHeading={
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-[#00e1ff] drop-shadow-[0_0_6px_rgba(0,225,255,0.8)]" />
            <span className="text-lg font-bold tracking-wider">Leaderboard</span>
          </div>
        }
      />

      {/* --- content wrapper --- */}
      <div className="flex-1 overflow-hidden">
        {/* sticky tabs */}
        <div className="sticky top-0 z-20 bg-[#1d0934]/70 backdrop-blur-lg shadow-inner shadow-black/20">
          <HorizontalTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={setActiveTab}
            light
          />
        </div>

        {/* panels */}
        <div className="h-full overflow-y-auto px-4 pb-28 pt-4 snap-y snap-mandatory ">
          <AnimatePresence mode="wait" initial={false}>
            {tabs.map((t) =>
              activeTab === t.index && (
                <motion.section
                  key={t.period}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="snap-start"
                >
                  <InnerTab period={t.period} />
                </motion.section>
              )
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- footer --- */}
      <Footer />
    </div>
  );
};

export default LeaderBoard;
