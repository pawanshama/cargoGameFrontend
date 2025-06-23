/*  src/Component/pages/Bet.tsx
    – version optimisée, zéro artefact GPU, no-TS warnings         */

import {
  useState, useEffect, useMemo, memo,
  useLayoutEffect, useCallback,
} from "react";
import Footer               from "../includes/Footer";
import Header               from "../includes/Header";
import Statistics           from "../modals/Statistics";
import CorgiPNG             from "../../assets/images/corgiWithShadow.png";
import CorgiWEBP            from "../../assets/images/corgiWithShadow.webp";
import DynamicRadio         from "../bet/RadioButtons";
import Button               from "../common/Button";
import IncrementInput       from "../bet/IncrementDecrementInput";
import UserTable            from "../bet/UserTable";
import OnlinePlayersStats   from "../bet/OnlinePlayersStats";
import ImgWithFallback      from "../common/ImageWithFallback";
import useTgSound           from "../../hooks/useTelegramSafeSound";
import MatchResult          from "./MatchResult";
import { motion }           from "framer-motion";

/* ───────────── Mini helper ───────────── */
const PotentialWinnings = memo(
  ({ amount, mult }: { amount: number; mult: number }) => (
    <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center">
      <p className="text-[0.65rem] opacity-90 leading-tight">Potential winnings</p>
      <p className="text-sm font-bold">${(amount * mult).toFixed(2)}</p>
    </div>
  ),
);

/* ───────────── Component ───────────── */
const Bet: React.FC = () => {
  /* state */
  const [ready, setReady]             = useState(false);
  const [match, setMatch]             = useState<null | Parameters<typeof MatchResult>[0]>(null);
  const [statsOpen, setStatsOpen]     = useState(false);
  const [radio, setRadio]             = useState<"ton" | "free-bet">("ton");
  const [iframeURL, setIframeURL]     = useState<string | null>(null);
  const [mult, setMult]               = useState(1);
  const [amount, setAmount]           = useState(0.1);
  const [tip, setTip]                 = useState(false);
  const [tipX, setTipX]               = useState(0);
  const [sending, setSending]         = useState(false);

  /* sounds */
  const playRadio    = useTgSound("/assets/sounds/13Select-Demofreeusdt.mp3");
  const playBet      = useTgSound("/assets/sounds/4Bet.mp3");
  const playAmount   = useTgSound("/assets/sounds/12Select-Amountbet.mp3");
  const suggestions  = useMemo(() => [1, 5, 25, 100], []);

  /* ───── 1. Telegram ready / expand ───── */
  useLayoutEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    if (!(tg as any)?.isExpanded) tg?.expand?.();

    const reset = () => { setAmount(0); setMult(1); };
    tg?.onEvent("resume", reset);

    setReady(true);
    return () => tg?.offEvent("resume", reset);
  }, []);

  /* ───── 2. iframe → retour lobby ───── */
  useEffect(() => {
    const h = (e: MessageEvent) => {
      if (e.data?.action === "goToMainScreen") {
        setIframeURL(null);
        setMatch(null);
        setSending(false);
      }
    };
    window.addEventListener("message", h);
    return () => window.removeEventListener("message", h);
  }, []);

  /* ───── 3. radio change ───── */
  const onRadio = (id: string) => {
    if (id !== radio) playRadio();
    setRadio(id as "ton" | "free-bet");
  };

  /* ───── 4. launch game ───── */
  const launch = useCallback(async () => {
    if (sending || amount < 0.1) return;
    setSending(true);
    playBet();

    try {
      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) throw new Error("initData missing");

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/match/start`, {
        method : "POST",
        headers: { "Content-Type": "application/json", Authorization: `tma ${initData}` },
        body   : JSON.stringify({ betAmount: amount }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const { matchToken } = await res.json();
      const url = new URL("https://corgi-game-dist.vercel.app/");
      url.searchParams.set("token", matchToken);
      url.searchParams.set("initData", encodeURIComponent(initData));
      setIframeURL(url.toString());
    } catch (err) {
      console.error(err);
      setSending(false);
    }
  }, [sending, amount, playBet]);

  /* ───── Early returns ───── */
  if (!ready) return null;

  if (match)
    return (
      <MatchResult
        {...match}
        onReplay={() => { setMatch(null); launch(); }}
        onQuit={()   => setMatch(null)}
      />
    );

  if (iframeURL)
    return (
      <div className="w-full h-screen overflow-hidden">
        <iframe
          src={iframeURL}
          title="Corgi game"
          className="w-full h-full border-none"
          allow="autoplay; fullscreen"
        />
      </div>
    );

  /* ───── Lobby ───── */
  return (
    <>
      {/* Header encapsulé pour z-index */}
      <div className="relative z-20">
        <Header pageHeading="" />
      </div>

      <div className="w-full bet-bg h-screen flex flex-col">
        <div className="flex-1 px-4 pb-[7.5rem] overflow-y-scroll overscroll-contain">
          {/* live table + stats */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex justify-center mb-1">
                <div className="flex items-center tableFont text-white bg-tableRow px-2 py-1 gap-1 rounded-3xl">
                  Live bets <span className="h-2 w-2 bg-primary rounded-full" />
                </div>
              </div>
              <UserTable />
            </div>
            <OnlinePlayersStats
              isStatisticsShow={statsOpen}
              setIsStatisticsShow={setStatsOpen}
            />
          </div>

          {/* mascot */}
          <div className="flex justify-center h-[9rem] -mt-1">
            <ImgWithFallback
              src={CorgiWEBP}
              fallback={CorgiPNG}
              alt="corgi"
              loading="eager"
              className="object-contain w-full"
            />
          </div>

          {/* bet panel */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 -mt-6 flex flex-col gap-3 rounded-2xl
                       bg-[rgba(45,30,99,0.30)]"
          >
            <div className="flex gap-4">
              {/* ─ left ─ */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white mb-1">Choose your bet source</p>
                <div className="flex gap-2">
                  <DynamicRadio id="ton" label="TON"      name="bet" selectedId={radio} onChange={onRadio} />
                  <DynamicRadio id="free-bet" label="Free Bet" name="bet" selectedId={radio} onChange={onRadio} />
                </div>

                <div className="mt-3">
                  <IncrementInput
                    suggestions={suggestions}
                    onAmountClick={playAmount}
                    onAmountChange={setAmount}
                  />
                </div>
              </div>

              {/* ─ right ─ */}
              <div className="flex flex-col gap-2 shrink-0 max-w-[10rem]">
                <div className="px-5 py-1 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-center text-white">
                  <p className="text-[0.65rem] opacity-70">Balance&nbsp;Available</p>
                  <p className="text-base font-extrabold">$0.00</p>
                  <p className="text-[0.6rem] opacity-60">
                    {radio === "ton" ? "0&nbsp;TON" : "Free&nbsp;Bets"}
                  </p>
                </div>

                <Button
                  type="button"
                  label="Bet"
                  additionalClass="animate-pulse-zoom w-full rounded-xl active:scale-95"
                  handleButtonClick={launch}
                />

                <PotentialWinnings amount={amount} mult={mult} />
              </div>
            </div>

            {/* slider */}
            <div className="-mt-2 px-2 py-1 flex items-center gap-3">
              <div className="relative w-full max-w-[85%]">
                <input
                  type="range" min="1" max="10" step="0.1"
                  value={mult}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setMult(v);
                    setTipX(((v - 1) / 9) * 100);
                  }}
                  onMouseDown={() => setTip(true)}
                  onMouseUp={()   => setTip(false)}
                  onTouchStart={() => setTip(true)}
                  onTouchEnd={()   => setTip(false)}
                  className="w-full appearance-none h-2 rounded-full
                             bg-gradient-to-r from-purple-500 to-pink-500"
                />
                {tip && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-7 -translate-x-1/2 px-2 py-1 bg-white text-black text-xs font-bold rounded pointer-events-none"
                    style={{ left: `calc(${tipX}% - 8px)` }}
                  >
                    x{mult.toFixed(1)}
                  </motion.div>
                )}
              </div>
              <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold">
                x{mult.toFixed(1)}
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>

      {/* stats modal */}
      {statsOpen && (
        <Statistics
          isStatisticsShow={statsOpen}
          setIsStatisticsShow={setStatsOpen}
        />
      )}
    </>
  );
};

export default Bet;
