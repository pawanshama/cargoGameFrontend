import { useState, useEffect, useMemo, memo, useRef } from "react";
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
import Game from "./Game";
import useTelegramSafeSound from "../../hooks/useTelegramSafeSound";
import MatchResult from "../pages/MatchResult";

const PotentialWinnings = memo(({ amount, multiplier }: { amount: number; multiplier: number }) => {
  return (
    <div className="px-3 py-[0.25rem] will-change-transform rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 shadow-md text-white w-full max-w-[10rem] text-center min-h-[2rem] transition-none">
      <p className="text-[0.65rem] font-medium opacity-90 tracking-wide leading-tight pointer-events-none select-none min-h-[1rem]">
        Potential winnings
      </p>
      <p className="text-sm font-bold mt-[0.15rem] min-h-[1.25rem]">
        ${ (amount * multiplier).toFixed(2) }
      </p>
    </div>
  );
});

const Bet = () => {
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
  const [multiplier, setMultiplier] = useState(1);
  const [amount, setAmount] = useState(0.1);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipX, setTooltipX] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const matchIdRef = useRef<string | null>(null);
  const surplusPoolIdRef = useRef<string | undefined>(undefined);
    const [resetKey, setResetKey] = useState(0);
  const [showUI, setShowUI] = useState(true); // NEW


  const suggestions = useMemo(() => [1, 5, 25, 100, 500], []);
  const playSelectRadio = useTelegramSafeSound("/assets/sounds/13Select-Demofreeusdt.mp3");
  const playBetSound = useTelegramSafeSound("/assets/sounds/4Bet.mp3");
  const playAmount = useTelegramSafeSound("/assets/sounds/12Select-Amountbet.mp3");

    useEffect(() => {
    const VERSION = "1.0.0";
    const LAST_VERSION = localStorage.getItem("app_version");
    if (LAST_VERSION !== VERSION) {
      localStorage.setItem("app_version", VERSION);
      window.location.href = window.location.pathname + "?v=" + Date.now();
      return;
    }
  }, []);

  useEffect(() => {
    const readyInterval = setInterval(() => {
      if (window.Telegram?.WebApp?.ready) {
        window.Telegram.WebApp.ready();
        clearInterval(readyInterval);
      }
    }, 100);

     const reloadOnResume = () => {
      console.log("[Telegram] Resume → React reset + reflow");
      setShowUI(false);
      setResetKey(prev => prev + 1);
      setMultiplier(1);
      setAmount(0);

      setTimeout(() => {
        setShowUI(true);
      }, 50);
    };
    window.Telegram?.WebApp?.onEvent("resume", reloadOnResume);

    return () => {
      clearInterval(readyInterval);
      window.Telegram?.WebApp?.offEvent("resume", reloadOnResume);
    };
  }, []);

  const handleRadioChange = (selectedId: string) => {
    if (selectedId !== selectedRadio) playSelectRadio();
    setSelectedRadio(selectedId);
  };

  const handleLaunchGame = async () => {
    console.log("▶️ handleLaunchGame lancé");
    console.log("Mise :", amount);
    if (isLoading || amount < 0.1) {
      console.warn("⛔ Mise invalide ou chargement en cours");
      return;
    }

    try {
      setIsLoading(true);
      playBetSound();

      const initData = window.Telegram?.WebApp?.initData;
if (!initData) throw new Error("initData not found");

const res = await fetch("https://corgi-in-space-backend-production.up.railway.app/api/match/start", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `tma ${initData}`,
  },
  body: JSON.stringify({ betAmount: amount }),
});




      if (!res.ok) {
  const text = await res.text();
  console.error(`Erreur HTTP ${res.status} : ${text}`);
  throw new Error(`Erreur HTTP ${res.status}`);
}
const data = await res.json();
console.log("📦 Réponse match/start:", data);

if (!data.matchId) throw new Error("Match ID not returned");
isAloneRef.current = data.status === "newPoolCreated";
matchIdRef.current = data.matchId;
surplusPoolIdRef.current = data.surplusPool?.id ?? undefined;
console.log("💾 ID de la surplus pool:", surplusPoolIdRef.current);
 // ✅ stocke l'ID du match surplus



 


      setShowGame(true);
    } catch (error) {
      console.error("❌ Erreur pendant le matchmaking :", error);
      setIsLoading(false);
    }
  };

  const isAloneRef = useRef(false);
  




  const handleAmountClick = () => playAmount();

  if (matchResult) {
    return (
      <MatchResult
        {...matchResult}
        onReplay={() => {
          setMatchResult(null);
          handleLaunchGame();
        }}
        onQuit={() => {
          setMatchResult(null);
        }}
      />
    );
  }

  if (showGame && matchIdRef.current) {
  return (
<Game
  matchId={matchIdRef.current}
  surplusPoolId={surplusPoolIdRef.current ?? undefined}
  isAlone={isAloneRef.current}
  onResolved={(data) => {
    console.log("✅ Résultat du match :", data);
    setMatchResult({
      result: data.result,
      userScore: data?.score ?? 0,
      opponentScore: data?.opponentScore ?? 0,
      betAmount: amount,
      reward: data.reward ?? 0,
    });
    setShowGame(false);
    setIsLoading(false);
  }}
/>




  );
}



    return (
    <>
      <div className="w-full bet-bg h-[100dvh]">
        <Header pageHeading="" />
        <div className="px-4 pb-[7.5rem] h-[calc(100dvh_-_clamp(4rem,60vw,6.05rem))] overflow-y-auto">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="flex items-center justify-center">
                <div className="flex justify-center tableFont text-white bg-tableRow p-[.375rem] gap-1 rounded-3xl">
                  Live bets
                  <span className="h-[.375rem] w-[.375rem] block bg-primary rounded-full"></span>
                </div>
              </div>
              <UserTable />
            </div>
            <OnlinePlayersStats
              isStatisticsShow={isStatisticsShow}
              setIsStatisticsShow={setIsStatisticsShow}
            />
          </div>

          <div className="flex items-center justify-center relative z-[1] h-[9.05rem] mt-[-0.375rem]">
            <ImgWithFallback
              src={CorgiOptimised}
              fallback={Corgi}
              alt="corgi-with-shadow"
              loading="lazy"
              className="object-contain w-full h-[9.05rem]"
            />
          </div>

          <div className="p-2 mt-[-1.7375rem] flex flex-col gap-[.625rem] rounded-2xl backdrop-blur-[.4375rem] bg-[rgba(45,30,99,0.10)]">
            <div className="flex justify-between gap-2 items-start">
              <div className="flex flex-col gap-2 mb-3">
                <p className="text-sm text-white font-medium">Choose your bet source:</p>
                <div className="flex items-center gap-2">
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
              </div>

              <div className="flex flex-col items-center justify-center text-center" style={{ transform: "translateX(-16px)" }}>
                <p className="textSmall text-white">Balance Available</p>
                <p className="text-base text-white font-black leading-4">
                  $0.00 <span className="text-xs font-normal">USD</span>
                </p>
                <p className="text-xs text-white font-normal">
                  {selectedRadio === "ton" && "0 TON"}
                  {selectedRadio === "free-bet" && "Free Bets"}
                  {selectedRadio === "play-demo" && "Demo Mode"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 max-w-[70%]">
                  {showUI && (
                    <IncrementDecrementInput
                      key={resetKey}
                      suggestions={suggestions}
                      onAmountClick={handleAmountClick}
                      onAmountChange={(value) => setAmount(value)}
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2 items-start">
                  <Button
                    type="button"
                    label="Bet"
                    additionalClass="!px-3 h-[3.75rem] w-full text-center justify-center max-w-[10rem] mt-[-0.01rem] rounded-xl transition-transform duration-100 active:scale-95"
                    handleButtonClick={handleLaunchGame}
                  />
                  {showUI && (
                    <PotentialWinnings
                      key={resetKey}
                      amount={amount}
                      multiplier={multiplier}
                    />
                  )}
                </div>
              </div>

              <div className="-mt-2 px-2 flex items-center gap-3">
                {showUI && (
                  <div className="relative w-full max-w-[85%]" key={resetKey}>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={multiplier}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setMultiplier(value);
                        const percent = ((value - 1) / 9) * 100;
                        setTooltipX(percent);
                      }}
                      onMouseDown={() => setShowTooltip(true)}
                      onMouseUp={() => setShowTooltip(false)}
                      onTouchStart={() => setShowTooltip(true)}
                      onTouchEnd={() => setShowTooltip(false)}
                      className="w-full appearance-none bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full cursor-pointer"
                    />
                    {showTooltip && (
                      <div
                        className="absolute -top-7 transform -translate-x-1/2 px-2 py-1 bg-white text-black text-xs font-bold rounded shadow pointer-events-none"
                        style={{ left: `calc(${tooltipX}% - 8px)` }}
                      >
                        x{multiplier.toFixed(1)}
                      </div>
                    )}
                  </div>
                )}

                {showUI && (
                  <div className="px-3 py-[0.375rem] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow-md">
                    x{multiplier.toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          </div>
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
