import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

import Logo from "../../assets/images/logo.png";
import LogoOptimised from "../../assets/images/logo.webp";
import GiftBox from "../../assets/images/gift-box.png";
import Profile from "../modals/Faq";
import {
  ArrowDownIcon,
  BellIcon,
  CurrencyIcon,
  UserIcon,
} from "../../assets/iconset";
import ImgWithFallback from "../common/ImageWithFallback";
import useTelegramSafeSound from "../../hooks/useTelegramSafeSound";
import NotificationModal from "../modals/NotificationModal"; // adapte le chemin si besoin


interface HeaderProps {
  pageHeading: React.ReactNode | string;
  refreshTrigger?: number; // 👈 nouvelle prop
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ pageHeading, refreshTrigger }) => {
  const [isBalanceDrop, setIsBalanceDrop] = useState(false);
  const [isProfileShow, setIsProfileShow] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [isMusicMuted, setIsMusicMuted] = useState(() => localStorage.getItem("isMusicMuted") === "true");
  const [wallet, setWallet] = useState<{ paidcoins: number; freecoins: number } | null>(null);

  const { user } = useUser();
  const playMenuSound: () => void = useTelegramSafeSound("/assets/sounds/22TOPMENUbuttons.mp3");
  const playSound = () => {
    playMenuSound(); // les sons d'interface ne sont PAS affectés par le mute musique
  };

  const balanceToggle = () => {
    playSound();
    setIsBalanceDrop(!isBalanceDrop);
  };

  const handleRedirectToProfile = () => {
    playSound();
     setIsBalanceDrop(false);
    setIsProfileShow(!isProfileShow);
  };

  const handleNotificationClick = async () => {
  playSound();
  setIsNotificationOpen(true); // ✅ Montre tout de suite le modal

  const initData = window.Telegram?.WebApp?.initData;
  if (!initData) return;

  try {
    await axios.get("https://corgi-in-space-backend-production.up.railway.app/api/notifications/all", {
      headers: { Authorization: `tma ${initData}` },
    });

    setUnreadCount(0); // ✅ Remet le compteur à zéro
  } catch (err) {
    console.error("❌ Erreur lors du fetch des notifications :", err);
  }
};



  const toggleMusicMute = () => {
    const newMuted = !isMusicMuted;
    localStorage.setItem("isMusicMuted", newMuted.toString());
    setIsMusicMuted(newMuted);
    if (!newMuted) playMenuSound();
  };

  const fetchWallet = async () => {
    try {
      if (!user?.id) return;

      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) return;

      const res = await axios.get("https://corgi-in-space-backend-production.up.railway.app/api/wallet/me", {
        headers: {
          Authorization: `tma ${initData}`,
        },
      });

      setWallet(res.data.wallet);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération du wallet :", error);
    }
  };

  useEffect(() => {
    fetchWallet(); // au premier chargement
    const interval = setInterval(fetchWallet, 10000); // toutes les 10 secondes
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (refreshTrigger !== undefined) {
      fetchWallet(); // 🔄 forçage manuel depuis Deposit/Withdraw
    }
  }, [refreshTrigger]);

  useEffect(() => {
  const fetchUnreadCount = async () => {
    try {
      if (!user?.id) return;
      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) return;

      const res = await axios.get("https://corgi-in-space-backend-production.up.railway.app/api/notifications/unread-count", {
        headers: {
          Authorization: `tma ${initData}`,
        },
      });

      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.error("❌ Erreur fetchUnreadCount:", err);
    }
  };

  fetchUnreadCount();
  const interval = setInterval(fetchUnreadCount, 10000); // rafraîchir toutes les 10s
  return () => clearInterval(interval);
}, [user]);



useEffect(() => {
  if (!user?.id) return;
  const initData = window.Telegram?.WebApp?.initData;
  if (!initData) return;

  const source = new EventSource(
  `https://corgi-in-space-backend-production.up.railway.app/api/notifications/stream?initData=${encodeURIComponent(initData)}`
);


  source.onmessage = (event) => {
    console.log("📨 Nouvelle notification SSE :", event.data);
    setUnreadCount((prev) => prev + 1);
  };

  source.addEventListener("connected", () => {
    console.log("✅ Connecté au flux SSE.");
  });

  source.onerror = (err) => {
    console.error("❌ Erreur SSE :", err);
    source.close();
  };

  return () => {
    source.close();
  };
}, [user]);

  return (
    <>
      <div className="flex flex-col w-full gap-2 px-5 py-2">
        <div className="flex items-center justify-between">
          {/* Logo + Balance */}
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
                className={`flex items-center justify-between p-2 bg-tableRow backdrop-blur-md w-full ${
                  isBalanceDrop ? "rounded-t-[1.25rem]" : "rounded-[1.25rem]"
                }`}
                onClick={balanceToggle}
              >
                <div className="flex items-center gap-[.375rem]">
                  <CurrencyIcon />
                  <div>
                    <p className="text-left text-white tableFont">Balance</p>
                    <p className="text-white textSamllBold">
                      {wallet && typeof wallet.paidcoins === "number"
                        ? wallet.paidcoins.toFixed(2)
                        : "0.00"}{" "}
                      TON
                    </p>
                  </div>
                </div>
                <span className={isBalanceDrop ? "rotate-180" : ""}>
                  <ArrowDownIcon />
                </span>
              </button>

              {isBalanceDrop && (
                <div className="w-full rounded-b-[1.25rem] border-t border-white bg-tableRow backdrop-blur-md z-20 flex items-center gap-2 p-2 absolute top-full left-0">
                  <img src={GiftBox} alt="GiftBox" loading="lazy" className="object-contain" />
                  <span className="tableFont text-white flex items-center gap-1">
                    <span className="tableFont text-white textSamllBold">
                      {wallet && typeof wallet.freecoins === "number"
                        ? wallet.freecoins.toFixed(2)
                        : "0.00"}
                    </span>{" "}
                    Free Bets
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notifications + Profile + Sound */}
          <div className="flex items-center gap-3 ml-2">
            <button
              type="button"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-tableRow backdrop-blur-md"
              onClick={handleNotificationClick}
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
              className="flex items-center justify-center w-10 h-10 rounded-full bg-tableRow backdrop-blur-md"
              onClick={handleRedirectToProfile}
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M16.5 12c0-1.77-.77-3.36-2-4.47v8.94c1.23-1.11 2-2.7 2-4.47z" />
                  <path d="M19 12c0 2.5-1 4.78-2.62 6.37l1.42 1.42C19.6 17.9 21 15.08 21 12s-1.4-5.9-3.2-7.8l-1.42 1.42C18 7.22 19 9.5 19 12zM4 9v6h4l5 5V4L8 9H4zM2.27 1L1 2.27 5.73 7H4v6h4l5 5V14.73l5 5 1.27-1.27L2.27 1z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-.77-3.36-2-4.47v8.94c1.23-1.11 2-2.7 2-4.47z" />
                  <path d="M14 3.23v2.06c2.89 1.04 5 3.87 5 7.71s-2.11 6.67-5 7.71v2.06c4.01-1.2 7-4.99 7-9.77s-2.99-8.57-7-9.77z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex text-center justify-center">
          <h1 className="text-center h1 text-white">{pageHeading}</h1>
        </div>
      </div>

      {isProfileShow && (
        <Profile setIsProfileShow={setIsProfileShow} />
      )}
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
