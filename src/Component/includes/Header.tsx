/* --------------------------------------------------------------------------
   src/Component/includes/Header.tsx
   -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useWallet } from "../context/WalletContext";

import Logo            from "../../assets/images/logo.png";
import LogoOptimised   from "../../assets/images/logo.webp";
import GiftBox         from "../../assets/images/gift-box.png";
import Profile         from "../modals/Faq";
import NotificationModal from "../modals/NotificationModal";
import ImgWithFallback from "../common/ImageWithFallback";
import useTelegramSafeSound from "../../hooks/useTelegramSafeSound";

import {
  ArrowDownIcon,
  BellIcon,
  CurrencyIcon,
  UserIcon,
} from "../../assets/iconset";

/* ------------------------------------------------------------------ types */

interface HeaderProps {
  pageHeading: React.ReactNode | string;
  className?: string;
}

/* ------------------------------------------------------------------ comp */

const Header: React.FC<HeaderProps> = ({ pageHeading }) => {
  /* ---------------- local UI state ---------------- */
  const [isBalanceDrop,    setIsBalanceDrop]    = useState(false);
  const [isProfileShow,    setIsProfileShow]    = useState(false);
  const [unreadCount,      setUnreadCount]      = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMusicMuted,     setIsMusicMuted]     = useState(
    () => localStorage.getItem("isMusicMuted") === "true",
  );

  /* ---------------- global state ------------------ */
  const { user }   = useUser();
  const { wallet } = useWallet();          // 🚀 solde depuis le contexte

  /* ---------------- sounds ------------------------ */
  const playMenuSound = useTelegramSafeSound("/assets/sounds/22TOPMENUbuttons.mp3");
  const playSound     = () => playMenuSound();

  /* ---------------- actions UI ------------------- */
  const balanceToggle = () => {
    playSound();
    setIsBalanceDrop((b) => !b);
  };

  const handleRedirectToProfile = () => {
    playSound();
    setIsBalanceDrop(false);
    setIsProfileShow((s) => !s);
  };

  const toggleMusicMute = () => {
    const muted = !isMusicMuted;
    localStorage.setItem("isMusicMuted", String(muted));
    setIsMusicMuted(muted);
    if (!muted) playMenuSound();
  };

  /* ---------------- notifications ---------------- */
  const handleNotificationClick = async () => {
    playSound();
    setIsNotificationOpen(true);

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) return;

    try {
      await axios.get(
        "https://ae0e-2402-e280-230d-3ff-945-fd4e-1470-53f8.ngrok-free.app/api/notifications/all",
        { headers: { Authorization: `tma ${initData}`, "Accept": "application/json" }, withCredentials: true },
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("❌ fetch notifications :", err);
    }
  };

  /* --- fetch unread count périodique + SSE stream --- */
  useEffect(() => {
    if (!user?.id) return;

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) return;

    const fetchUnread = async () => {
      try {
        const { data } = await axios.get(
          "https://ae0e-2402-e280-230d-3ff-945-fd4e-1470-53f8.ngrok-free.app/api/notifications/unread-count",
          { headers: { Authorization: `tma ${initData}`, "Accept": "application/json" }, withCredentials: true },
        );
        setUnreadCount(data.count || 0);
      } catch (e) {
        console.error("❌ fetchUnreadCount:", e);
      }
    };

    /* 1️⃣ initial + polling 10 s */
    fetchUnread();
    const id = setInterval(fetchUnread, 10_000);

    /* 2️⃣ SSE temps réel */
    const source = new EventSource(
      `https://ae0e-2402-e280-230d-3ff-945-fd4e-1470-53f8.ngrok-free.app/api/notifications/stream?initData=${encodeURIComponent(initData)}`,
    );
    source.onmessage = () => setUnreadCount((c) => c + 1);
    source.onerror   = (err) => {
      console.error("❌ SSE err :", err);
      source.close();
    };

    return () => {
      clearInterval(id);
      source.close();
    };
  }, [user]);

  /* --------------------------------------------------------------------- */

  return (
    <>
      <div className="flex flex-col w-full gap-2 px-5 py-2">
        {/* ------------------------------------------------ top row */}
        <div className="flex items-center justify-between">
          {/* -------- logo + balance */}
          <div className="flex items-center gap-2 flex-1">
            <ImgWithFallback
              src={LogoOptimised}
              fallback={Logo}
              alt="Logo"
              loading="eager"
              className="w-[4.5rem] h-[4.5rem]"
            />

            <div className="relative flex-1">
              <button
                type="button"
                onClick={balanceToggle}
                className={`flex items-center justify-between p-2 bg-tableRow backdrop-blur-md w-full ${
                  isBalanceDrop ? "rounded-t-[1.25rem]" : "rounded-[1.25rem]"
                }`}
              >
                <div className="flex items-center gap-[.375rem]">
                  <CurrencyIcon />
                  <div>
                    <p className="text-left text-white tableFont">Balance</p>
                    <p className="text-white textSamllBold">
                      {wallet ? wallet.paidcoins.toFixed(2) : "0.00"} TON
                    </p>
                  </div>
                </div>
                <span className={isBalanceDrop ? "rotate-180" : ""}>
                  <ArrowDownIcon />
                </span>
              </button>

              {isBalanceDrop && (
                <div className="w-full rounded-b-[1.25rem] border-t border-white bg-tableRow backdrop-blur-md z-20 flex items-center gap-2 p-2 absolute top-full left-0">
                  <img src={GiftBox} alt="GiftBox" loading="lazy" />
                  <span className="tableFont text-white flex items-center gap-1">
                    <span className="textSamllBold">
                      {wallet ? wallet.freecoins.toFixed(2) : "0.00"}
                    </span>{" "}
                    Free Bets
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* -------- notif + profile + sound */}
          <div className="flex items-center gap-3 ml-2">
            <button
              type="button"
              onClick={handleNotificationClick}
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-tableRow backdrop-blur-md"
            >
              {unreadCount > 0 && (
                <span className="bg-primary w-3 h-3 rounded-full absolute -top-[.0625rem] right-[.25rem] tableFont leading-[.6875rem] text-black text-[10px] flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              <BellIcon />
            </button>

            <button
              type="button"
              onClick={handleRedirectToProfile}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-tableRow backdrop-blur-md"
            >
              <UserIcon />
            </button>

            <button
              onClick={toggleMusicMute}
              title={isMusicMuted ? "Activer la musique" : "Couper la musique"}
              aria-label={isMusicMuted ? "Activer la musique" : "Couper la musique"}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-tableRow backdrop-blur-md shadow-md"
            >
              {isMusicMuted ? (
                /* icône volume off */
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M16.5 12c0-1.77-.77-3.36-2-4.47v8.94c1.23-1.11 2-2.7 2-4.47z" />
                  <path d="M19 12c0 2.5-1 4.78-2.62 6.37l1.42 1.42C19.6 17.9 21 15.08 21 12s-1.4-5.9-3.2-7.8l-1.42 1.42C18 7.22 19 9.5 19 12zM4 9v6h4l5 5V4L8 9H4zM2.27 1L1 2.27 5.73 7H4v6h4l5 5V14.73l5 5 1.27-1.27L2.27 1z" />
                </svg>
              ) : (
                /* icône volume on */
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-.77-3.36-2-4.47v8.94c1.23-1.11 2-2.7 2-4.47z" />
                  <path d="M14 3.23v2.06c2.89 1.04 5 3.87 5 7.71s-2.11 6.67-5 7.71v2.06c4.01-1.2 7-4.99 7-9.77s-2.99-8.57-7-9.77z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ------------------------------------------------ heading */}
        <div className="flex justify-center">
          <h1 className="h1 text-white">{pageHeading}</h1>
        </div>
      </div>

      {/* ------------- modals */}
      {isProfileShow && <Profile setIsProfileShow={setIsProfileShow} />}
      {isNotificationOpen && (
        <NotificationModal
          isOpen={isNotificationOpen}
          setIsOpen={setIsNotificationOpen}
        />
      )}
    </>
  );
};

export default Header;
