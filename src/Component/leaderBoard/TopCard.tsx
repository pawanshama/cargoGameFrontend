/* ===========================================================================
   src/Component/leaderBoard/TopCard.tsx
   Copie-colle ce fichier complet – compatible avec le nouvel InnerTab
   ========================================================================== */

import React from "react";
import { motion } from "framer-motion";
import { CurrencyLeaderBoardIcon } from "../../assets/iconset";

/* ------------------------------------------------------------------ */
/*                               TYPES                                */
/* ------------------------------------------------------------------ */
export interface CardData {
  rank: number;
  profilePic: string;
  title: string;
  amount: number;
  isCurrentUser?: boolean;
  isLast?: boolean;
}

/* ------------------------------------------------------------------ */
/*                             HELPERS                                */
/* ------------------------------------------------------------------ */
const money = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

const suffix = (r: number) =>
  ["th", "st", "nd", "rd"][(r % 100 >> 3) ^ 1 && r % 10] || "th";

/* ------------------------------------------------------------------ */
/*                          PODIUM CARD                               */
/* ------------------------------------------------------------------ */
const podiumGrad = [
  "linear-gradient(135deg,#f7ce46 0%,#ffeb91 100%)",   // gold
  "linear-gradient(135deg,#c0c0c0 0%,#e1e1e1 100%)",   // silver
  "linear-gradient(135deg,#cd7f32 0%,#e8a569 100%)",   // bronze
];

const PodiumCard: React.FC<CardData> = ({ rank, profilePic, title, amount, isCurrentUser }) => {
  const size = rank === 1 ? "w-20 h-20" : "w-16 h-16";

  return (
    <motion.li
      layout
      whileHover={{ y: -4 }}
      className="flex w-full flex-col items-center gap-2 rounded-b-3xl p-4"
      style={{ backgroundImage: podiumGrad[rank - 1] }}
    >
      {/* Rank */}
      <h3 className="font-designer text-3xl text-white drop-shadow">
        {rank}
        <span className="text-xl">{suffix(rank)}</span>
      </h3>

      {/* Avatar */}
      <img
        src={profilePic}
        alt={`${title} avatar`}
        className={`${size} rounded-full ring-2 ring-white/60 object-cover`}
        loading="lazy"
      />

      {/* Username */}
      <p className="truncate text-sm font-semibold text-white/90">{title}</p>

      {/* Profit */}
      <div className="flex items-center gap-1">
        <CurrencyLeaderBoardIcon small />
        <span className="text-primary text-sm">{money(amount)}</span>
      </div>

      {/* YOU badge on podium if needed */}
      {isCurrentUser && (
        <span className="absolute -top-2 -right-2 rounded-full bg-[#2CFD95] px-2 py-[2px] text-[10px] font-bold text-black shadow">
          YOU
        </span>
      )}
    </motion.li>
  );
};

/* ------------------------------------------------------------------ */
/*                             ROW CARD                               */
/* ------------------------------------------------------------------ */
const RowCard: React.FC<CardData> = ({
  rank,
  profilePic,
  title,
  amount,
  isCurrentUser,
  isLast,
}) => (
  <div className="relative">
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className={`relative flex items-center gap-4 rounded-xl px-4 py-3`}
    >
      {/* Highlight background */}
      {isCurrentUser && (
        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-[#6443ff]/40 to-[#22e584]/40 backdrop-blur-sm" />
      )}

      {/* Badge YOU */}
      {isCurrentUser && (
        <span className="absolute -top-2 -right-2 rounded-full bg-[#2CFD95] px-2 py-[2px] text-[10px] font-bold text-black shadow">
          YOU
        </span>
      )}

      {/* Avatar */}
      <img
        src={profilePic}
        alt={`${title} avatar`}
        className="h-10 w-10 rounded-full ring-1 ring-white/40 object-cover"
        loading="lazy"
      />

      {/* Info */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <p className="truncate text-sm font-medium text-white">{title}</p>
        <div className="flex items-baseline gap-1">
          <CurrencyLeaderBoardIcon />
          <span className="text-xs text-gray-300">Profit</span>
          <span className="text-sm font-semibold text-primary">{money(amount)}</span>
        </div>
      </div>

      {/* Rank */}
      <h3 className="font-designer text-2xl text-white">
        {rank}
        <span className="text-[0.8rem]">{suffix(rank)}</span>
      </h3>
    </motion.div>

    {/* Divider */}
    {!isLast && <div className="mx-4 border-b border-white/10" />}
  </div>
);

/* ------------------------------------------------------------------ */
/*                            EXPORT                                  */
/* ------------------------------------------------------------------ */
const TopCard: React.FC<CardData> = (props) =>
  props.rank <= 3 ? <PodiumCard {...props} /> : <RowCard {...props} />;

export default TopCard;
