import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import ImgWithFallback from "../common/ImageWithFallback";
import useTelegramSafeSound from "../../hooks/useTelegramSafeSound";

import TopIcon from "../../assets/images/topIcon.png";
import TopIconOptimised from "../../assets/images/topIcon.webp";
import TopIconActive from "../../assets/images/topActive.png";
import TopIconActiveOptimised from "../../assets/images/topActive.webp";

import FreeBetIcon from "../../assets/images/freeBet.png";
import FreeBetIconOptimised from "../../assets/images/freeBet.webp";
import FreeBetIconActive from "../../assets/images/freeBetActive.png";
import FreeBetIconActiveOptimised from "../../assets/images/freeBetActive.webp";

import BetIcon from "../../assets/images/betIcon.png";
import BetIconOptimised from "../../assets/images/betIcon.webp";
import BetIconActive from "../../assets/images/betActive.png";
import BetIconActiveOptimised from "../../assets/images/betActive.webp";

import WalletIcon from "../../assets/images/walletIcon.png";
import WalletIconOptimised from "../../assets/images/walletIcon.webp";
import WalletIconActive from "../../assets/images/walletIconActive.png";
import WalletIconActiveOptimised from "../../assets/images/walletIconActive.webp";

import QuesIcon from "../../assets/images/faqIcon.png";
import QuesIconOptimised from "../../assets/images/faqIcon.webp";
import QuesIconActive from "../../assets/images/faqActive.png";
import QuesIconActiveOptimised from "../../assets/images/faqActive.webp";

interface NavItem {
  link: string;
  imgSrc: string;
  imgSrcOptimised: string;
  imgSrcActive: string;
  imgSrcActiveOptimised: string;
  name: string;
}

const navItems: NavItem[] = [
  {
    link: "/free-bet",
    imgSrc: FreeBetIcon,
    imgSrcOptimised: FreeBetIconOptimised,
    imgSrcActive: FreeBetIconActive,
    imgSrcActiveOptimised: FreeBetIconActiveOptimised,
    name: "Free Bet",
  },
  {
    link: "/top",
    imgSrc: TopIcon,
    imgSrcOptimised: TopIconOptimised,
    imgSrcActive: TopIconActive,
    imgSrcActiveOptimised: TopIconActiveOptimised,
    name: "Top",
  },
  {
    link: "/bet",
    imgSrc: BetIcon,
    imgSrcOptimised: BetIconOptimised,
    imgSrcActive: BetIconActive,
    imgSrcActiveOptimised: BetIconActiveOptimised,
    name: "Bet",
  },
  {
    link: "/wallet",
    imgSrc: WalletIcon,
    imgSrcOptimised: WalletIconOptimised,
    imgSrcActive: WalletIconActive,
    imgSrcActiveOptimised: WalletIconActiveOptimised,
    name: "Wallet",
  },
  {
    link: "/airdrop",
    imgSrc: QuesIcon,
    imgSrcOptimised: QuesIconOptimised,
    imgSrcActive: QuesIconActive,
    imgSrcActiveOptimised: QuesIconActiveOptimised,
    name: "AirDrop",
  },
];

const Footer = () => {
  const playClickSound = useTelegramSafeSound("/assets/sounds/6Downmenu.mp3");

  // ✅ Étape 1 : préchargement des images actives
  useEffect(() => {
    navItems.forEach((item) => {
      new Image().src = item.imgSrcActiveOptimised;
      new Image().src = item.imgSrcActive;
    });
  }, []);

  return (
    <div className="fixed bottom-0 pb-6 px-5 left-1/2 -translate-x-1/2 max-w-[640px] w-full backdrop-blur-[.0625rem] z-50">
      <nav className="px-6 py-2 bg-black/70 backdrop-blur-md rounded-[2.5rem] flex items-center justify-between">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.link}
            onClick={() => {
              playClickSound();
            }}
            className="flex justify-center flex-col gap-1 items-center bg-transparent"
          >
            {({ isActive }) => (
              <>
                <ImgWithFallback
  src={isActive ? item.imgSrcActiveOptimised : item.imgSrcOptimised}
  fallback={isActive ? item.imgSrcActive : item.imgSrc}
  alt={`${item.name} icon`}
  loading="eager"
  className="h-10 w-10 object-contain"
/>


                {isActive && (
                  <div className="w-6 h-[2px] bg-white rounded-full my-1"></div>
                )}

                <p
                  className={`text-center text-sm ${
                    isActive ? "font-bold text-white" : "text-disabled"
                  }`}
                >
                  {item.name}
                </p>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Footer;
