"use client";

import { ParticleField } from "@/components/effects/ParticleField";
import { useScrollStore } from "@/store/scrollStore";
import { useSyncExternalStore } from "react";

const BG_SPEED = 0.3;

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
 * Background layer: translateY at 0.3× scroll for depth vs main content (1× via Lenis).
 */
export function ParallaxBackdrop() {
  const scrollY = useScrollStore((s) => s.scrollY);
  const reduce = usePrefersReducedMotion();
  const y = reduce ? 0 : scrollY * BG_SPEED;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        transform: `translate3d(0, ${y}px, 0)`,
        willChange: reduce ? undefined : "transform",
      }}
      aria-hidden
    >
      <ParticleField />
      <div className="absolute inset-0 bg-gradient-to-b from-empire-gold/[0.08] via-transparent to-empire-bronze/[0.06]" />
    </div>
  );
}
