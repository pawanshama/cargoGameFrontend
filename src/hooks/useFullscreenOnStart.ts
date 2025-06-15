import { useEffect } from "react";

const useFullscreenOnStart = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) return;

    tg.ready(); // Toujours appeler ready()

    // Tente de passer en fullscreen (si pris en charge)
    if (tg.isVersionAtLeast?.("8.0") && tg.requestFullscreen) {
      tg.requestFullscreen();
    }

    // Étend l'app (utile sur mobile pour passer en plein écran natif)
    if (tg.expand) {
      tg.expand();
    }
  }, []);
};

export default useFullscreenOnStart;
