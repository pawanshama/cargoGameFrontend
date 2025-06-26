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
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-[#160028] via-[#1c0934] to-[#2b1048] text-white">
      <Header pageHeading="Airdrop" />

      <div className="px-4 py-6 max-w-3xl mx-auto space-y-10 pb-[10rem] h-[calc(100dvh_-_clamp(6rem,60vw,8.25rem))] overflow-y-auto">
        {/* TIMER */}
        <motion.div
          className="w-full rounded-2xl border-2 border-[#00FFB2] p-4 bg-[#1f0238] shadow-[0_0_15px_#00FFB2] text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[15px] sm:text-[17px] font-bold text-white uppercase font-designer whitespace-nowrap">
            ⏳ Airdrop ends in:{" "}
            <span className="text-[#00FFB2] inline-block text-center font-mono min-w-[120px]">
              {timeLeft}
            </span>
          </p>
        </motion.div>

        {/* COIN & LEVEL */}
        <motion.div
          className="bg-zinc-900 p-6 rounded-2xl shadow-md text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="w-14 h-14 animate-pulse-orbit rounded-full bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 border-2 border-yellow-300 flex items-center justify-center shadow-[0_0_15px_rgba(255,223,0,0.7)] text-yellow-900 font-bold text-2xl">
              $
            </div>
            <div className="text-3xl font-extrabold tracking-tight font-designer text-white">
              {coinsEarned.toLocaleString("en-US")}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-300 mb-3">
            <span
              className="font-medium underline cursor-pointer hover:text-[#00FFB2]"
              onClick={() => setShowModal(true)}
            >
              {levelName}
            </span>
            <span className="font-medium">Level {level}/{maxLevel}</span>
          </div>

          <div className="w-full h-4 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 shadow-[0_0_12px_rgba(192,38,211,0.6)]"
              style={{ width: `${(level / maxLevel) * 100}%` }}
            />
          </div>

          {nextLevel && (
            <p className="text-xs text-gray-400 text-center mt-2">
              You need <strong>{nextLevel.remaining.toLocaleString("en-US")} coins</strong> to reach <strong>{nextLevel.name}</strong>.
            </p>
          )}
        </motion.div>

        {/* Start Farming Button */}
        <div className="w-full text-center">
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
              className="px-6 py-3 mt-4 rounded-full bg-gradient-to-br from-green-400 to-teal-500 text-white font-bold shadow-lg hover:scale-105 transition-transform"
            >
              🚀 Start Farming Coins
            </motion.button>
          ) : (
            <div className="text-green-400 font-bold mt-4 animate-pulse">
              ⛏️ Farming started! 1 coin/sec
            </div>
          )}
        </div>

        {/* HOW TO EARN COINS */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-[17px] sm:text-[19px] font-bold text-white uppercase font-designer underline underline-offset-4 decoration-white text-center mb-6">
            🎁 How to earn coins?
          </h2>
          <ul className="list-disc ml-6 text-base space-y-4 text-white">
            <li>
              <strong>1. Go to the “Bet” page:</strong> choose one of the available modes: <em>TON</em>, <em>Freebet</em>, or <em>Farming Mode</em>.
            </li>
            <li>
              <strong>2. Farming Mode:</strong> no deposit required — just play and earn coins based on your score.
            </li>
            <li>
              <strong>3. Freebet Mode:</strong> play for free and earn coins depending on your performance.
            </li>
            <li>
              <strong>4. TON Mode:</strong> deposit real TON (min. 0.1 TON) and boost your rewards — your score is multiplied by 5!
              <br />
              <em>Example:</em> Score 50 with 0.1 TON → <strong>250 coins</strong> + potential earnings from the match.
            </li>
          </ul>
        </motion.div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
          <div className="bg-zinc-900 p-6 rounded-2xl max-w-md w-full relative shadow-xl text-white">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-white text-lg"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">🌟 Farming Levels</h2>
            <ul className="space-y-3 text-sm max-h-[400px] overflow-y-auto pr-2 mb-4">
              {levels.map((lvl, idx) => (
                <li key={lvl.name}>
                  <strong>{idx + 1}. {lvl.name}</strong> ({lvl.min.toLocaleString()} coins) — {lvl.reward}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-300 text-center mt-2">
              At the end of the airdrop, you'll receive your earned coins <strong>plus a bonus</strong> based on your level. The bonus amount shown above corresponds to the level you've reached.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AirdropPage;
