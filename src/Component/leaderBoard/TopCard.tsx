import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";                       // ➜ pnpm add clsx (1 kB lib, optional)
import { CurrencyLeaderBoardIcon } from "../../assets/iconset";

type Period = "profit" | "wagered";           // ➜ adapte si tu veux plusieurs métriques

interface CardData {
  rank: number;
  profilePic: string;
  title: string;
  amount: number;
  metric?: Period;
  isLast?: boolean;
  isCurrentUser?: boolean;
}

/* --------------------------- utilitaires --------------------------- */
const formatMoney = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

const suffix = (r: number) =>
  ["th", "st", "nd", "rd"][(r % 100 >> 3) ^ 1 && r % 10] || "th";

/* ----------------------------- Styles ------------------------------ */
const podiumGradients = [
  "from-[#ffd700]/80 to-[#ffec8b]/40",          // 1er – or
  "from-[#c0c0c0]/70 to-[#e0e0e0]/30",          // 2ᵉ – argent
  "from-[#cd7f32]/70 to-[#e5a96b]/40",          // 3ᵉ – bronze
];

/* --------------------------- Composant ----------------------------- */
const TopCard: React.FC<CardData> = ({
  rank,
  profilePic,
  title,
  amount,
  metric = "profit",
  isLast,
  isCurrentUser,
}) => {
  /* ----- Podium (top 3) ----- */
  if (rank <= 3) {
    return (
      <motion.li
        layout
        whileHover={{ y: -4 }}
        className={clsx(
          "flex flex-col items-center gap-2 rounded-b-3xl p-4 w-full",
          `bg-gradient-to-br ${podiumGradients[rank - 1]}`
        )}
      >
        <h3 className="font-designer text-3xl text-white drop-shadow">
          {rank}
          <span className="text-xl">{suffix(rank)}</span>
        </h3>

        <img
          src={profilePic}
          alt={`${title}'s avatar`}
          className={clsx(
            rank === 1 ? "w-16 h-16" : "w-12 h-12",
            "rounded-full ring-2 ring-white/60"
          )}
          loading="lazy"
        />

        <p className="text-sm font-semibold text-white/90 truncate">{title}</p>

        <div className="flex items-center gap-1">
          <CurrencyLeaderBoardIcon small />
          <span className="text-primary text-sm">{formatMoney(amount)}</span>
        </div>
      </motion.li>
    );
  }

  /* ----- Rang ≥ 4 ----- */
  return (
    <>
      <motion.div
        layout
        whileHover={{ scale: 1.015 }}
        className={clsx(
          "relative flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300",
          isCurrentUser
            ? "bg-gradient-to-r from-purple-800 to-purple-600 ring-1 ring-purple-400/60 shadow-lg"
            : "bg-white/5 backdrop-blur-md"
        )}
      >
        {/* badge YOU */}
        {isCurrentUser && (
          <span className="absolute -top-2 -right-2 rounded-full bg-[#2CFD95] px-2 py-[2px] text-xs font-bold text-black shadow">
            YOU
          </span>
        )}

        {/* avatar */}
        <img
          src={profilePic}
          alt={`${title}'s avatar`}
          className="h-10 w-10 rounded-full ring-1 ring-white/30 object-cover"
          loading="lazy"
        />

        {/* infos */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <p className="truncate text-sm font-medium text-white">{title}</p>

          <div className="flex items-baseline gap-1">
            <CurrencyLeaderBoardIcon />
            <span className="text-xs text-gray-300 capitalize">{metric}</span>
            <span className="text-sm font-semibold text-primary">
              {formatMoney(amount)}
            </span>
          </div>
        </div>

        {/* rang */}
        <h3 className="font-designer text-2xl text-white">
          {rank}
          <span className="text-[0.8rem]">{suffix(rank)}</span>
        </h3>
      </motion.div>

      {/* divider */}
      {!isLast && <div className="mx-4 border-b border-white/10" />}
    </>
  );
};

export default TopCard;
