import { useEffect, useRef } from "react";

const useTelegramSafeSound = (url: string) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const loadSound = async () => {
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuffer);
        bufferRef.current = decoded;
      } catch (error) {
        console.error("Erreur lors du chargement du son :", error);
      }
    };

    loadSound();

    return () => {
      ctx.close();
    };
  }, [url]);

  const play = async () => {
    try {
      const ctx = audioCtxRef.current;
      const buffer = bufferRef.current;

      if (!ctx || !buffer) return;

      // Reprendre le contexte s’il est suspendu
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Créer une nouvelle source à chaque lecture
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (e) {
      console.warn("Erreur de lecture du son :", e);
    }
  };

  return play;
};

export default useTelegramSafeSound;
