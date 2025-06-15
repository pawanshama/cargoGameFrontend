import { useEffect } from "react";

const useBackgroundMusic = (url: string, volume: number) => {
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const gainNode = ctx.createGain();
    let buffer: AudioBuffer | null = null;
    let source: AudioBufferSourceNode | null = null;

    gainNode.connect(ctx.destination);

    const setup = () => {
      if (!buffer) return;

      source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNode);

      const isMusicMuted = localStorage.getItem("isMusicMuted") === "true";
      gainNode.gain.value = isMusicMuted ? 0 : volume;

      if (!isMusicMuted) {
        ctx.resume().then(() => {
          try {
            source?.start(0);
          } catch (e) {
            console.warn("🔇 start(0) failed:", e);
          }
        });
      }

      const unlockAudio = () => {
        const stillMuted = localStorage.getItem("isMusicMuted") === "true";
        if (!stillMuted && ctx.state !== "running") {
          ctx.resume().catch(() => {});
        }
      };

      window.addEventListener("click", unlockAudio, { once: true });
    };

    // 🔄 Vérifie régulièrement l'état du mute dans localStorage (fonctionne dans même onglet)
    const interval = setInterval(() => {
      const isMusicMuted = localStorage.getItem("isMusicMuted") === "true";
      gainNode.gain.value = isMusicMuted ? 0 : volume;
    }, 300); // léger et fluide

    fetch(url)
      .then(res => res.arrayBuffer())
      .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
      .then(decoded => {
        buffer = decoded;
        setup();
      });

    return () => {
      try {
        source?.stop();
      } catch (e) {}
      ctx.close();
      clearInterval(interval);
    };
  }, [url, volume]);
};

export default useBackgroundMusic;
