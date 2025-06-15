import { useEffect, useState } from "react";
import axios from "axios";

interface NotificationModalProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

interface Notification {
  text: string;
  createdAt: string;
  status: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, setIsOpen }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) return;

    axios
      .get("https://corgi-in-space-backend-production.up.railway.app/api/notifications/all", {
        headers: {
          Authorization: `tma ${initData}`,
        },
      })
      .then((res) => {
        setNotifications(res.data.notifications || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Erreur récupération notifs :", err);
        setLoading(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col justify-between rounded-t-[10px] shadow-[0px_0px_100px_0px_rgba(0,0,0,0.05)] backdrop-blur-[1.5625rem] bg-black/[0.6] h-[100dvh] overflow-y-auto w-full max-w-[640px] pb-[6rem]">
      <div className="absolute top-3 right-4">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="h-[1.875rem] w-[1.875rem] bg-transparent active:scale-90 transition-transform duration-100 ease-in-out text-white text-xl"
        >
          ×
        </button>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full py-4 px-5 gap-8">
        <h2 className="text-center text-white text-2xl font-bold uppercase">Notifications</h2>

        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-gray-400 text-center">Loading...</p>
          ) : notifications.length === 0 ? (
            <div className="text-center text-white/60 text-sm font-lato mt-8">
              No notifications yet
            </div>
          ) : (
            notifications.map((notif, i) => (
              <div
                key={i}
                className="relative border border-[#9752b9] rounded-xl px-4 py-3 bg-[#1f0238] group"
              >
                <p className="text-sm leading-snug text-white font-lato pr-8">{notif.text}</p>
                <p className="text-xs text-white/40 font-lato mt-1 pr-8">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
