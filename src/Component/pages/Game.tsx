/* ------------------------------------------------------------------
   src/components/Game.tsx   –  instrumentation complète
   ------------------------------------------------------------------ */

import { useEffect } from "react";
import Phaser from "phaser";
import axios from "axios";
import config from "../../game/GameConfig";

type GameProps = {
  matchId: string;
  surplusPoolId?: string;
  isAlone: boolean;
  onResolved: (result: any) => void;
};

const BACKEND = "https://ae0e-2402-e280-230d-3ff-945-fd4e-1470-53f8.ngrok-free.app";

const Game = ({ matchId, surplusPoolId, isAlone, onResolved }: GameProps) => {
  useEffect(() => {
    /* ─────────────── Mount ─────────────── */
    console.log("🧠 [Game] mounted", { matchId, surplusPoolId, isAlone });

    let destroyed = false;
    let gameInstance: Phaser.Game;

    /* ========== onGameEnd (exposé au jeu) ========== */
    (window as any).onGameEnd = async (score: number) => {
      if (destroyed) {
        console.warn("⛔️ [Game] onGameEnd after unmount – ignore");
        return;
      }

      console.log("🏁 [Game] onGameEnd", { score });

      try {
        const initData = window.Telegram?.WebApp?.initData;
        if (!initData) throw new Error("initData Telegram introuvable");

        const headers = {
          Authorization: `tma ${initData}`,
          "Content-Type": "application/json",
        };

        /* 1️⃣ /match/finish ------------------------------------------------ */
        console.log("🛰️ [Game] POST /match/finish →", { matchId, score });
        const finishRes = await axios.post(
          `${BACKEND}/api/match/finish`,
          { matchId, score },
          { headers },
        );
        console.log("✅ [Game] /match/finish OK", finishRes.data);

        if (finishRes.data.status !== "finished") {
          console.warn("⚠️ /match/finish status!=finished → abort");
          return;
        }

        /* 2️⃣ /pool/finish (si surplus) ----------------------------------- */
        if (surplusPoolId) {
          console.log("🛰️ [Game] POST /pool/finish →", {
            poolId: surplusPoolId,
            score,
          });
          try {
            const poolRes = await axios.post(
              `${BACKEND}/api/pool/finish`,
              { poolId: surplusPoolId, score },
              { headers },
            );
            console.log("✅ [Game] /pool/finish OK", poolRes.data);
          } catch (err) {
            console.error("❌ [Game] /pool/finish ERROR", err);
          }
        }

        /* 3️⃣ Mode solo : pas de /match/resolve --------------------------- */
        if (isAlone) {
          console.log("🎮 [Game] Solo mode → resolve locally (Draw)");
          onResolved({
            result: "Draw",
            score,
            opponentScore: 0,
            reward: 0,
          });
          return;
        }

        /* 4️⃣ /match/resolve ---------------------------------------------- */
        console.log("🛰️ [Game] POST /match/resolve →", { matchId });
        const resolveRes = await axios.post(
          `${BACKEND}/api/match/resolve`,
          { matchId },
          { headers },
        );
        console.log("✅ [Game] /match/resolve response", resolveRes.data);

        if (resolveRes.data.status === "resolved") {
          onResolved({ ...resolveRes.data, score });
        } else {
          console.warn("⚠️ /match/resolve status!=resolved → fallback");
          onResolved({
            result: "Draw",
            score,
            opponentScore: resolveRes.data?.opponentScore ?? 0,
            reward: resolveRes.data?.reward ?? 0,
          });
        }
      } catch (err) {
        console.error("❌ [Game] onGameEnd global ERROR", err);
      }
    };

    /* ========== Instanciation Phaser ========== */
    console.log("🎮 [Game] Phaser instanciation");
    gameInstance = new Phaser.Game(config);

    /* ========== Resize handler ========== */
    const resize = () => {
      console.log("📐 [Game] resize", {
        w: window.innerWidth,
        h: window.innerHeight,
      });
      gameInstance.scale.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", resize);

    /* ========== Cleanup ========== */
    return () => {
      destroyed = true;
      window.removeEventListener("resize", resize);
      gameInstance.destroy(true);
      delete (window as any).onGameEnd;
      console.log("🏁 [Game] unmounted & cleaned");
    };
  }, [matchId, surplusPoolId, isAlone, onResolved]); // deps

  return (
    <div
      id="game-container"
      className="fixed top-0 left-0 w-screen h-[100dvh] z-[999] overflow-hidden bg-black"
    />
  );
};

export default Game;
