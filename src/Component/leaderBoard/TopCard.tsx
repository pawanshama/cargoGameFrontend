/* ===========================================================================
   src/Component/leaderBoard/TopCard.tsx
   Version finale — contraste podium, spacing cohérent, flèche bleue ready
   ========================================================================== */

import React from "react";
import { motion } from "framer-motion";
import { CurrencyLeaderBoardIcon } from "../../assets/iconset";

/* ----------------------------- TYPES ----------------------------- */
export interface CardData {
  rank: number;
  profilePic: string;
  title: string;
  amount: number;
  isCurrentUser?: boolean;
  isLast?: boolean;          // facultatif mais conservé si tu veux d'autres séparateurs
}

/* --------------------------- HELPERS ----------------------------- */
const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const suffix = (r: number) =>
  ["th", "st", "nd", "rd"][(r % 100 >> 3) ^ 1 && r % 10] || "th";

/* ------------------------ PODIUM CARD --------------------------- */
const podiumPalette = [
  /* Gold   */ ["#f5c83b", "#dba927"],
  /* Silver */ ["#adb4c2", "#8d949f"],
  /* Bronze */ ["#c1834d", "#a06b39"],
];

const PodiumCard: React.FC<CardData> = ({
  rank,
  profilePic,
  title,
  amount,
  isCurrentUser,
}) => {
  const [from, to]  = podiumPalette[rank - 1];
  const size        = rank === 1 ? "h-20 w-20" : "h-16 w-16";

  return (
    <motion.li
      layout
      whileHover={{ y: -4 }}
      className="relative flex w-full flex-col items-center gap-2 rounded-b-3xl p-4"
      style={{ background: `linear-gradient(135deg,${from} 0%,${to} 100%)` }}
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
        className={`${size} rounded-full ring-2 ring-white/70 object-cover`}
        loading="lazy"
      />

      {/* Name */}
      <p className="max-w-[6rem] truncate text-sm font-semibold text-white/90 text-center">
        {title}
      </p>

      {/* Profit */}
      <div className="flex items-center gap-1">
        <CurrencyLeaderBoardIcon small />
        <span className="text-primary text-sm">{money(amount)}</span>
      </div>

      {/* YOU badge */}
      {isCurrentUser && (
        <span className="absolute -top-2 -right-2 rounded-full bg-[#2CFD95] px-2 py-[2px] text-[10px] font-bold text-black shadow">
          YOU
        </span>
      )}
    </motion.li>
  );
};

/* -------------------------- ROW CARD --------------------------- */
const RowCard: React.FC<CardData> = ({
  rank,
  profilePic,
  title,
  amount,
  isCurrentUser,
}) => (
  <motion.div
    layout
    whileHover={{ scale: 1.015 }}
    className="relative flex items-center gap-4 rounded-xl bg-white/5/30 px-4 py-3 backdrop-blur-md"
  >
    {/* highlight */}
    {isCurrentUser && (
      <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-[#6443ff]/35 to-[#22e584]/35" />
    )}

    {/* badge */}
    {isCurrentUser && (
      <span className="absolute -top-2 -right-2 rounded-full bg-[#2CFD95] px-2 py-[2px] text-[10px] font-bold text-black shadow">
        YOU
      </span>
    )}

    {/* avatar */}
    <img
      src={profilePic}
      alt={`${title} avatar`}
      className="h-10 w-10 rounded-full ring-1 ring-white/40 object-cover"
      loading="lazy"
    />

    {/* player info */}
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
);

/* --------------------------- EXPORT ----------------------------- */
const TopCard: React.FC<CardData> = (props) =>
  props.rank <= 3 ? <PodiumCard {...props} /> : <RowCard {...props} />;

export default TopCard;
