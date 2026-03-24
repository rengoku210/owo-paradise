"use client";

import { useUiStore } from "@/store/uiStore";

function playBlip(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = enabled ? 660 : 440;
    g.gain.value = 0.04;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.06);
    ctx.resume().catch(() => {});
  } catch {
    /* optional feature */
  }
}

/** Tiny ambient UI toggle — only plays when user enables sound (browser autoplay policies). */
export function SoundToggle() {
  const { soundEnabled, setSoundEnabled } = useUiStore();

  return (
    <button
      type="button"
      data-cursor-glow="strong"
      onClick={() => {
        const next = !soundEnabled;
        setSoundEnabled(next);
        playBlip(next);
      }}
      className="glass-panel fixed bottom-6 right-6 z-[100] px-4 py-2 text-xs font-medium text-white/80 transition hover:border-neon-cyan/40 hover:text-white"
      aria-pressed={soundEnabled}
      aria-label={soundEnabled ? "Disable UI sounds" : "Enable UI sounds"}
    >
      {soundEnabled ? "Sound: On" : "Sound: Off"}
    </button>
  );
}
