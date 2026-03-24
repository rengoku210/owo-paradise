"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const TRAIL_LERP = 0.1;

function targetHasGlow(clientX: number, clientY: number) {
  const el = document.elementFromPoint(clientX, clientY);
  return Boolean(el?.closest("[data-cursor-glow]"));
}

/**
 * Soft dot + trail; stronger bloom when hovering interactive targets (`data-cursor-glow`).
 */
export function CustomCursor() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [strongGlow, setStrongGlow] = useState(false);
  const trail = useRef({ x: 0, y: 0 });
  const trailEl = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 400, damping: 32, mass: 0.28 });
  const sy = useSpring(my, { stiffness: 400, damping: 32, mass: 0.28 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const move = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setStrongGlow(targetHasGlow(e.clientX, e.clientY));
    };

    window.addEventListener("pointermove", move, { passive: true });
    let raf = 0;

    const tick = () => {
      const tx = mx.get();
      const ty = my.get();
      trail.current.x += (tx - trail.current.x) * TRAIL_LERP;
      trail.current.y += (ty - trail.current.y) * TRAIL_LERP;
      if (trailEl.current) {
        trailEl.current.style.transform = `translate3d(${trail.current.x}px, ${trail.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [mx, my, reduceMotion]);

  if (reduceMotion) return null;

  const trailClass = strongGlow
    ? "bg-neon-pink/35 blur-md"
    : "bg-neon-purple/25 blur-md";
  const coreShadow = strongGlow
    ? "shadow-[0_0_22px_rgba(255,120,220,1),0_0_48px_rgba(92,243,255,0.55)] ring-2 ring-neon-pink/70"
    : "shadow-[0_0_18px_rgba(255,120,220,0.85),0_0_32px_rgba(92,243,255,0.35)] ring-2 ring-neon-pink/40";

  return (
    <>
      <div
        ref={trailEl}
        className={`pointer-events-none fixed left-0 top-0 z-[9998] hidden h-5 w-5 rounded-full md:block ${trailClass}`}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        aria-hidden
      >
        <div
          className={`h-3 w-3 rounded-full bg-white/90 transition-[box-shadow,transform] duration-200 ${coreShadow}`}
        />
      </motion.div>
    </>
  );
}
