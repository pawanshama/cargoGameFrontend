import { useEffect, useState } from "react";
import Footer from "../includes/Footer";
import Header from "../includes/Header";
import { motion } from "framer-motion"; // For animations

const AirdropPage = () => {
  const [timeLeft, setTimeLeft] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState<number>(0);
  const [isFarming, setIsFarming] = useState<boolean | null>(null);

  const initData = window.Telegram?.WebApp?.initData || "";

  const fetchUserAircoinMetadata = async () => {
    try {
      const res = await fetch("/api/aircoins/me", {
        headers: {
          Authorization: `tma ${initData}`,
        },
      });
      const data = await res.json();
      setCoinsEarned(data.aircoinsTotal || 0);
      setIsFarming(data.isFarming);
    } catch (err) {
      console.error("Erreur /aircoins/me :", err);
    }
  };

  useEffect(() => {
    fetchUserAircoinMetadata();
  }, []);

  useEffect(() => {
    if (!isFarming || !initData) return;

    let counter = 0;
    const interval = setInterval(async () => {
      try {
        await fetch("/api/aircoins/increment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `tma ${initData}`,
          },
        });

        setCoinsEarned((prev) => {
          counter += 1;
          if (counter % 10 === 0) {
            fetchUserAircoinMetadata(); // Sync every 10 seconds
          }
          return prev + 1;
        });
      } catch (err) {
        console.error("❌ Erreur update farming:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isFarming, initData]);

  const maxLevel = 9;
  const levels = [
    { name: "Ember", min: 0, reward: "🎁 1,000 coins" },
    { name: "Spark", min: 1_000, reward: "🎁 2,000 coins" },
    { name: "Flame", min: 10_000, reward: "🎁 5,000 coins" },
    { name: "Blaze", min: 100_000, reward: "🎁 10,000 coins" },
    { name: "Inferno", min: 1_000_000, reward: "🎁 20,000 coins" },
    { name: "Meteor", min: 10_000_000, reward: "🎁 50,000 coins" },
    { name: "Nova", min: 50_000_000, reward: "🎁 100,000 coins" },
    { name: "Eclipse", min: 100_000_000, reward: "🎁 250,000 coins" },
    { name: "Grandmaster", min: 200_000_000, reward: "🎁 500,000 coins" },
  ];

  const getLevel = () => {
    let currentLevel = levels[0];
    for (const lvl of levels) {
      if (coinsEarned >= lvl.min) currentLevel = lvl;
    }
    return {
      name: currentLevel.name,
      index: levels.findIndex((lvl) => lvl.name === currentLevel.name) + 1,
    };
  };

  const getNextLevel = () => {
    for (const lvl of levels) {
      if (coinsEarned < lvl.min) {
        return {
          name: lvl.name,
          remaining: lvl.min - coinsEarned,
        };
      }
    }
    return null;
  };

  const { name: levelName, index: level } = getLevel();
  const nextLevel = getNextLevel();

  useEffect(() => {
    const end = new Date("2025-07-01T00:00:00Z");
    const updateTimer = () => {
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Airdrop ended");
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#160028] via-[#1c0934] to-[#2b1048] text-white font-inter">
      <Header pageHeading="Airdrop" />

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-10">
        {/* TIMER */}
        <motion.div
          className="bg-gradient-to-r from-[#00FFB2] via-[#00E1FF] to-[#6B00FF] p-6 rounded-xl text-center shadow-2xl backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-extrabold text-xl text-white">
            ⏳ Airdrop ends in:{" "}
            <span className="text-[#00FFB2] font-mono">{timeLeft}</span>
          </p>
        </motion.div>

        {/* COIN & LEVEL */}
        <motion.div
          className="bg-gradient-to-t from-[#1e1e1e] to-[#2a2a2a] p-8 rounded-xl shadow-xl backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#ff8c00] to-[#ff5a00] rounded-full flex items-center justify-center shadow-xl text-white text-3xl font-bold">
              $
            </div>
            <div className="text-4xl font-extrabold text-white">{coinsEarned.toLocaleString()}</div>
          </div>

          <div className="text-center text-sm text-gray-300">
            <span className="font-medium text-[#00FFB2]">{levelName}</span> | Level {level}/{maxLevel}
          </div>

          <div className="w-full h-2 mt-4 bg-gray-600 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
              style={{ width: `${(level / maxLevel) * 100}%` }}
            />
          </div>

          {nextLevel && (
            <p className="text-xs text-gray-400 text-center mt-2">
              {nextLevel.remaining.toLocaleString()} more coins to reach{" "}
              <strong>{nextLevel.name}</strong>
            </p>
          )}
        </motion.div>

        {/* Start Farming Button */}
        <div className="w-full text-center mt-8">
          {isFarming === null ? null : !isFarming ? (
            <motion.button
              onClick={async () => {
                const telegramId = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id;

                if (!telegramId) {
                  console.error("❌ Impossible de récupérer telegram_id");
                  return;
                }

                await fetch("/api/startfarming", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `tma ${initData}`,
                  },
                  body: JSON.stringify({ telegram_id: telegramId }),
                });

                setIsFarming(true);
              }}
              className="px-8 py-4 mt-6 rounded-full bg-gradient-to-br from-green-400 to-teal-500 text-white font-bold shadow-lg hover:scale-105 transition-transform"
            >
              🚀 Start Farming Coins
            </motion.button>
          ) : (
            <div className="text-green-400 font-bold mt-4 animate-pulse">
              ⛏️ Farming started! 1 coin/sec
            </div>
          )}
        </div>

        {/* How to Earn Coins Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-lg font-semibold text-white text-center mb-6">
            🎁 How to Earn Coinss
          </h2>
          <ul className="text-base text-white space-y-4">
            <li><strong>Choose between different modes:</strong> TON, Freebet, or Farming Mode.</li>
            <li><strong>Farming Mode:</strong> No deposit required, just play and earn coins.</li>
            <li><strong>Freebet Mode:</strong> Play for free and earn coins based on your performance.</li>
            <li><strong>TON Mode:</strong> Deposit TON to multiply your score by 5 and boost rewards.</li>
          </ul>
        </motion.div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-[#1e1e1e] p-6 rounded-2xl max-w-md w-full relative shadow-xl text-white">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-white text-lg"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">🌟 Farming Levels</h2>
            <ul className="space-y-3 text-sm max-h-[400px] overflow-y-auto">
              {levels.map((lvl, idx) => (
                <li key={lvl.name}>
                  <strong>{idx + 1}. {lvl.name}</strong> ({lvl.min.toLocaleString()} coins) — {lvl.reward}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-300 text-center mt-2">
              At the end of the airdrop, you'll receive your earned coins <strong>plus a bonus</strong> based on your level.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AirdropPage;
