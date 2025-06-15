import { useEffect } from "react";
import Phaser from "phaser";
import axios from "axios";
import config from "../../game/GameConfig";

const Game = ({
  matchId,
  surplusPoolId, // ← AJOUTÉ
  isAlone,
  onResolved,
}: {
  matchId: string;
  surplusPoolId?: string; // ← AJOUTÉ
  isAlone: boolean;
  onResolved: (result: any) => void;
}) => {

  useEffect(() => {
    console.log("🧠 Game.tsx mounted", { matchId, surplusPoolId, isAlone });
    let destroyed = false;
    let gameInstance: Phaser.Game;

    // 🧠 Injecter d'abord onGameEnd dans le window
    (window as any).onGameEnd = async (score: number) => {
      if (destroyed) {
        console.warn("⛔️ onGameEnd appelé après unmount !");
        return;
      }
      console.log("🏁 onGameEnd déclenché avec score :", score);

      try {
        const initData = window.Telegram?.WebApp?.initData;
        if (!initData) throw new Error("❌ initData Telegram introuvable");

        const headers = {
          Authorization: `tma ${initData}`,
          "Content-Type": "application/json",
        };

// 1️⃣ /match/finish principal

console.log("📤 Appel à /match/finish", { matchId, score });

const finishRes = await axios.post(
  "https://corgi-in-space-backend-production.up.railway.app/api/match/finish",
  { matchId, score },
  { headers }
);

if (finishRes.data.status !== "finished") {
  console.warn("⚠️ Score non enregistré :", finishRes.data);
  return;
}
console.log("✅ Réponse de /match/finish :", finishRes.data);

// 2️⃣ Mise à jour de la surplusPool si elle existe
if (surplusPoolId) {
  console.log("➕ Envoi du score pour surplusPool :", surplusPoolId);
  console.log("📤 Appel à /pool/finish", { poolId: surplusPoolId, score });
  await axios.post(
    "https://corgi-in-space-backend-production.up.railway.app/api/pool/finish",
    { poolId: surplusPoolId, score },
    { headers }
  );
  console.log("✅ Réponse de /pool/finish reçue (aucune erreur levée)");

}


        


        // 3️⃣ Mode solo = draw
        if (isAlone) {
          console.log("🎮 Mode solo détecté, envoi du résultat local");
          onResolved({
            result: "Draw",
            score,
            opponentScore: 0,
            reward: 0,
          });
          return;
        }

        // 4️⃣ /match/resolve
        const resolveRes = await axios.post(
          "https://corgi-in-space-backend-production.up.railway.app/api/match/resolve",
          { matchId },
          { headers }
        );
        console.log("📤 Appel à /match/resolve", { matchId });

        if (resolveRes.data.status === "resolved") {
          console.log("✅ Réponse reçue de /match/resolve :", resolveRes.data);
          onResolved({
            ...resolveRes.data,
            score,
          });
        } else {
          console.warn("⚠️ Résolution échouée, fallback activé :", resolveRes.data);
  console.log("🔥 resolve fallback exécuté");
          

          onResolved({
            result: "Draw",
            score,
            opponentScore: resolveRes.data?.opponentScore ?? 0,
            reward: resolveRes.data?.reward ?? 0,
          });
           
        }
      } catch (err) {
        console.error("❌ Erreur onGameEnd :", err);
      }
    };

    // ✅ Instanciation du jeu
    gameInstance = new Phaser.Game(config);

    // 🎯 Resize handler
    const resize = () => {
      gameInstance.scale.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", resize);

    // 🔚 Cleanup
    return () => {
      destroyed = true;
      window.removeEventListener("resize", resize);
      gameInstance.destroy(true);
      delete (window as any).onGameEnd;
      console.log("🏁 Game destroyed and onGameEnd cleaned");
    };
}, [matchId, surplusPoolId, isAlone, onResolved]); // ✅


  return (
    <div
      id="game-container"
      className="fixed top-0 left-0 w-screen h-[100dvh] z-[999] overflow-hidden bg-black"
    />
  );
};

export default Game;
