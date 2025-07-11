/* src/Component/pages/Bet.tsx */

import {
  useState,
  useEffect,
  useMemo,
  memo,
  useLayoutEffect,
  useCallback,
} from "react";
import Footer from "../includes/Footer";
import Header from "../includes/Header";
import Statistics from "../modals/Statistics";
import Corgi from "../../assets/images/corgiWithShadow.png";
import CorgiOptimised from "../../assets/images/corgiWithShadow.webp";
import DynamicRadio from "../bet/RadioButtons";
import Button from "../common/Button";
import IncrementDecrementInput from "../bet/IncrementDecrementInput";
import UserTable from "../bet/UserTable";
import OnlinePlayersStats from "../bet/OnlinePlayersStats";
import ImgWithFallback from "../common/ImageWithFallback";
import useTelegramSafeSound from "../../hooks/useTelegramSafeSound";
import MatchResult from "./MatchResult";
import { motion } from "framer-motion";
import useInvalidateMission1 from "../../hooks/useInvalidateMission1";
import useMission1Query from "../../hooks/useMission1Query";

/* ---------- Helpers ---------- */
const PotentialWinnings = memo(
  ({ amount, multiplier }: { amount: number; multiplier: number }) => (
    <div className="px-3 py-[0.25rem] rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 shadow-md text-white w-full max-w-[10rem] text-center min-h-[2rem]">
      <p className="text-[0.65rem] font-medium opacity-90">
        Potential winnings
      </p>
      <p className="text-sm font-bold">${(amount * multiplier).toFixed(2)}</p>
    </div>
  )
);

/* ---------- Component ---------- */
const Bet: React.FC = () => {
  useMission1Query({ refetchInterval: 5_000, staleTime: 0 });
  /* state */
  const [pageReady, setPageReady] = useState(false); // évite le flash
  const [matchResult, setMatchResult] = useState<null | {
    result: "Won" | "Lost" | "Draw";
    userScore: number;
    opponentScore: number;
    betAmount: number;
    reward: number;
  }>(null);

  const [isStatisticsShow, setIsStatisticsShow] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("ton");
  const [showGame, setShowGame] = useState(false);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [amount, setAmount] = useState(0.1);
  const [showTooltip, setShowTooltip] = useState(false);
  // const [tooltipX, setTooltipX] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const invalidateMission1 = useInvalidateMission1();

  /* sounds */
  const suggestions = useMemo(() => [1, 5, 25, 100], []);
  const playSelectRadio = useTelegramSafeSound(
    "/assets/sounds/13Select-Demofreeusdt.mp3"
  );
  const playBetSound = useTelegramSafeSound("/assets/sounds/4Bet.mp3");
  const playAmountSound = useTelegramSafeSound(
    "/assets/sounds/12Select-Amountbet.mp3"
  );

  /* ------------------------------------------------------------------ */
  /* 1. Synchronisation Telegram → ready() + expand()                   */
  /* ------------------------------------------------------------------ */
  useLayoutEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      setPageReady(true);
      return;
    }

    if (tg) {
      tg.ready();
      const expanded = (tg as any).isExpanded as boolean | undefined;
      if (!expanded) tg.expand();
    }

    const onResume = () => {
      setAmount(0);
      setMultiplier(1);
    };
    tg.onEvent("resume", onResume);

    setPageReady(true);
    return () => tg.offEvent("resume", onResume);
  }, []);

  /* 2. iFrame → retour au lobby */
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      // Vérifie l’origine (remplace par le domaine réel du jeu)
      if (!e.data?.action || !e.origin.endsWith("https://cargo-game-backend.vercel.app"))
        return;

      switch (e.data?.action) {
        case "goToMainScreen":
          setShowGame(false);
          setGameUrl(null);
          setMatchResult(null);
          setIsLoading(false);
          invalidateMission1();
          setTimeout(invalidateMission1, 3_000); // 2ᵉ refetch de secours

          break;

        case "PERFECT_HIT":
          // HAPTIC : top-frame déclenche la vibration pour le mobile
          try {
            const tg = window.Telegram?.WebApp;

            // iOS : impactOccurred fonctionne
            if (tg?.HapticFeedback?.impactOccurred?.("medium")) return;

            // Android : impactOccurred est muet → on bascule sur notificationOccurred
            if (tg?.HapticFeedback?.notificationOccurred?.("success")) return;

            // Fallback navigateur (hors WebApp ou desktop)
            navigator.vibrate?.(35);
          } catch (_) {
            /* silence */
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [invalidateMission1]);

  /* 3. Select radio */
  const handleRadioChange = (id: string) => {
    if (id !== selectedRadio) playSelectRadio();
    setSelectedRadio(id);
  };

  /* 4. Bet / launch game */
  const handleLaunchGame = useCallback(async () => {
    if (isLoading || amount < 0.1) return;

    try {
      setIsLoading(true);
      playBetSound();

      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) throw new Error("initData missing");

      const r = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/match/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `tma ${initData}`,
          },
          body: JSON.stringify({ betAmount: amount }),
        }
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      console.log("retruned response after start, before matchData :",r);
      const { matchToken } = await r.json();
      console.log("retured response after match start :",matchToken);
      if (!matchToken) throw new Error("token missing");

      const url = new URL("https://cargo-game.vercel.app/");
      url.searchParams.set("token", matchToken);
      url.searchParams.set("initData", encodeURIComponent(initData));
      console.log("url", url)
      console.log("url href: ", url.href)
      setGameUrl(url.toString());
      setShowGame(true);

      invalidateMission1();

      setTimeout(invalidateMission1, 4_000); // refetch instantané /mission1/status
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, [isLoading, amount, playBetSound, invalidateMission1]);

  /* 5. Match result overlay */
  if (matchResult)
    return (
      <MatchResult
        {...matchResult}
        onReplay={() => {
          setMatchResult(null);
          handleLaunchGame();
        }}
        onQuit={() => setMatchResult(null)}
      />
    );

  /* 6. In-game iframe */
  if (showGame && gameUrl) {
    // console.log("🔗 [Bet] gameUrl", gameUrl);
    return (
      <div className="w-full h-[100dvh] overflow-hidden">
        <iframe
          src={gameUrl}
          title="Corgi Game"
          className="w-full h-full border-none"
          allow="autoplay; fullscreen; vibrate"
        />{" "}
        {/* autorise navigator.vibrate */}
      </div>
    );
  }

  /* 7. — LOBBY — */
  if (!pageReady) return null; // évite flash

  return (
    <>
      <div className="w-full bet-bg h-[100dvh]">
        <Header pageHeading="" />

        <div className="px-4 pb-[7.5rem] h-[calc(100dvh_-_clamp(4rem,60vw,6.05rem))] overflow-y-auto">
          {/* ---------- live table + stats ---------- */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="flex justify-center">
                <div className="flex items-center tableFont text-white bg-tableRow px-2 py-1 gap-1 rounded-3xl">
                  Live bets <span className="h-2 w-2 bg-primary rounded-full" />
                </div>
              </div>
              <UserTable />
            </div>
            <OnlinePlayersStats
              isStatisticsShow={isStatisticsShow}
              setIsStatisticsShow={setIsStatisticsShow}
            />
          </div>

          {/* ---------- mascot ---------- */}
          <div className="flex justify-center h-[9rem] mt-[-0.375rem]">
            <ImgWithFallback
              src={CorgiOptimised}
              fallback={Corgi}
              alt="corgi-with-shadow"
              loading="eager"
              className="object-contain w-full"
            />
          </div>

          {/* ---------- bet panel ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 -mt-6 flex flex-col gap-3 rounded-2xl backdrop-blur-[6px] bg-[rgba(45,30,99,0.15)]"
          >
            {/* source + amount */}
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white mb-1">
                  Choose your bet source
                </p>
                <div className="flex gap-2">
                  <DynamicRadio
                    label="TON"
                    id="ton"
                    name="bet"
                    selectedId={selectedRadio}
                    onChange={handleRadioChange}
                  />
                  <DynamicRadio
                    label="Free Bet"
                    id="free-bet"
                    name="bet"
                    selectedId={selectedRadio}
                    onChange={handleRadioChange}
                  />
                </div>

                <div className="mt-3">
                  <IncrementDecrementInput
                    suggestions={suggestions}
                    onAmountClick={() => playAmountSound()}
                    onAmountChange={setAmount}
                  />
                </div>
              </div>

              {/* side card */}
              <div className="flex flex-col gap-2 items-start shrink-0 max-w-[10rem]">
                <div className="px-5 py-1 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-center text-white w-full">
                  <p className="text-[0.65rem] opacity-70">Balance Available</p>
                  <p className="text-base font-extrabold">$0.00</p>
                  <p className="text-[0.6rem] opacity-60">
                    {selectedRadio === "ton" && "0 TON"}
                    {selectedRadio === "free-bet" && "Free Bets"}
                  </p>
                </div>

                <Button
                  type="button"
                  label="Bet"
                  additionalClass="animate-pulse-zoom w-full rounded-xl active:scale-95"
                  handleButtonClick={handleLaunchGame}
                />

                <PotentialWinnings amount={amount} multiplier={multiplier} />
              </div>
            </div>

            {/* ---------- slider multiplier ---------- */}
            <div className="-mt-2 px-2 py-1 flex items-center gap-3">
              <div className="relative w-full max-w-[85%]">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={multiplier}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setMultiplier(v);
                    // setTooltipX(((v - 1) / 9) * 1000);
                  }}
                  onMouseDown={() => setShowTooltip(true)}
                  onMouseUp={() => setShowTooltip(false)}
                  onTouchStart={() => setShowTooltip(true)}
                  onTouchEnd={() => setShowTooltip(false)}
                  className="w-full appearance-none bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full cursor-pointer"
                />
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-7 -translate-x-1/2 px-2 py-1 bg-white text-black text-xs font-bold rounded pointer-events-none"
                    style={{
                      left: `${((multiplier - 1) / 9) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    x{multiplier.toFixed(1)}
                  </motion.div>
                )}
              </div>
              <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow-md">
                x{multiplier.toFixed(1)}
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>

      {isStatisticsShow && (
        <Statistics
          isStatisticsShow={isStatisticsShow}
          setIsStatisticsShow={setIsStatisticsShow}
        />
      )}
    </>
  );
};

export default Bet;
