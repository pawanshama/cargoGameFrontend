import { useState, useEffect, useMemo, memo } from "react";
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
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [multiplier, setMultiplier] = useState(1);
  const [amount, setAmount] = useState(0.1);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipX, setTooltipX] = useState(0);
  const [isLoading, setIsLoading] = useState(false);



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
        window.Telegram.WebApp.expand();
        clearInterval(readyInterval);
      }
    }, 100);

    const reloadOnResume = () => {
      console.log("[Telegram] Resume → reset values");
      setAmount(0);
      setMultiplier(1);
    };

    window.Telegram?.WebApp?.onEvent("resume", reloadOnResume);
    return () => {
      clearInterval(readyInterval);
      window.Telegram?.WebApp?.offEvent("resume", reloadOnResume);
    };
  }, []);


  useEffect(() => {
  const handler = (event: MessageEvent) => {
    if (event.data?.action === "goToMainScreen") {
      console.log("📨 Message reçu depuis l'iframe :", event.data);
      setShowGame(false);
      setGameUrl(null);
      setMatchResult(null);
      setIsLoading(false); // ✅ Ajoute ça
    }
  };

  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
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
    if (!initData) throw new Error("initData non trouvé");

    // Appel sécurisé : /match/start
// 🎯 Appel sécurisé à /match/start
const tokenRes = await fetch("https://corgi-in-space-backend-production.up.railway.app/api/match/start", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `tma ${initData}`, // Toujours initData ici
  },
  body: JSON.stringify({
    betAmount: amount, // La mise uniquement (le backend génère matchId, poolId, etc.)
  }),
});

// 🧪 Vérifie la réponse HTTP
if (!tokenRes.ok) {
  const text = await tokenRes.text();
  throw new Error(`Erreur HTTP ${tokenRes.status} : ${text}`);
}

// ✅ Récupère et vérifie le token
const resJson = await tokenRes.json();
console.log("📡 Réponse du backend /match/start :", resJson);

const { matchToken: token } = resJson;

if (!token) {
  throw new Error("❌ Token manquant dans la réponse backend");
}

// 🕹️ Injection du token dans l'URL du jeu
const url = new URL("https://corgi-game-dist.vercel.app/");
url.searchParams.set("token", token);
url.searchParams.set("initData", encodeURIComponent(initData)); // ✅ injecte aussi initData
console.log("🎯 Token + initData injectés dans l'iframe :", url.toString());

setGameUrl(url.toString());

setShowGame(true);

  } catch (error) {
    console.error("❌ Erreur pendant le matchmaking :", error);
    setIsLoading(false);
  }
};



  




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

if (showGame && gameUrl) {
  return (
    <div className="w-full h-[100dvh] overflow-hidden">
      <iframe
        src={gameUrl}
        title="Corgi Game"
        className="w-full h-full border-none"
        allow="autoplay; fullscreen"
      />
    </div>
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
              loading="eager"
              className="object-contain w-full h-[9.05rem]"
            />
          </div>

          <div className="p-2 mt-[-1.7375rem] flex flex-col gap-[.625rem] rounded-2xl backdrop-blur-[.4375rem] bg-[rgba(45,30,99,0.10)]">
            <div className="flex items-start gap-4 w-full">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
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

                <div className="w-full mt-3">
                  <IncrementDecrementInput
                    suggestions={suggestions}
                    onAmountClick={handleAmountClick}
                    onAmountChange={setAmount}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 items-start max-w-[10rem] self-start shrink-0">
                <div className="px-5 py-1 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-center text-white mb-1 w-full">
                  <p className="text-[0.65rem] text-white/70 mb-[0.15rem] leading-tight">Balance Available</p>
                  <p className="text-base font-extrabold leading-none">
                    $0.00 <span className="text-xs font-normal text-white/70">USD</span>
                  </p>
                  <p className="text-[0.6rem] text-white/60 leading-tight mt-[0.15rem]">
                    {selectedRadio === "ton" && "0 TON"}
                    {selectedRadio === "free-bet" && "Free Bets"}
                    {selectedRadio === "play-demo" && "Demo Mode"}
                  </p>
                </div>

                <Button
                  type="button"
                  label="Bet"
                  additionalClass="animate-pulse-zoom !px-3 h-[3.75rem] w-full text-center justify-center rounded-xl transition-transform duration-100 active:scale-95"
                  handleButtonClick={handleLaunchGame}
                />

                <PotentialWinnings amount={amount} multiplier={multiplier} />
              </div>
            </div>

            <div className="-mt-2 px-2 py-1 flex items-center gap-3">
              <div className="relative w-full max-w-[85%]">
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

              <div className="px-3 py-[0.375rem] rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow-md">
                x{multiplier.toFixed(1)}
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
