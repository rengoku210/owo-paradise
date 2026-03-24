"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { useUiStore } from "@/store/uiStore";

const HOVER_SRC = "/sounds/hover.mp3";
const VOLUME = 0.2;

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

/**
 * Soft hover for primary CTAs and selected cards only.
 * Respects sound toggle + prefers-reduced-motion. Resets `currentTime` before play.
 */
export function useUISound() {
  const reduceMotion = usePrefersReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playHover = useCallback(() => {
    if (reduceMotion) return;
    if (!useUiStore.getState().soundEnabled) return;
    let a = audioRef.current;
    if (!a) {
      a = new Audio(HOVER_SRC);
      a.preload = "auto";
      a.volume = VOLUME;
      audioRef.current = a;
    }
    try {
      a.currentTime = 0;
      void a.play().catch(() => {});
    } catch {
      /* missing file or autoplay policy */
    }
  }, [reduceMotion]);

  return { playHover, reduceMotion };
}
