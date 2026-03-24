"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useScrollStore } from "@/store/scrollStore";
import { isScrollBurstActive } from "@/lib/scrollBurst";
import { MagneticButton } from "@/components/ui/MagneticButton";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => ({ default: m.HeroScene })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-night to-night" />
    ),
  }
);

const invite =
  process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "https://discord.com/channels/@me";

const FLOATERS = [
  { label: "#announcements", sub: "Patch notes", left: "-6%", top: "18%", delay: 0.2, seed: 1 },
  { label: "Voice · Karaoke", sub: "Live now", left: "78%", top: "22%", delay: 0.35, seed: 2 },
  { label: "Reaction roles", sub: "Pick your color", left: "8%", top: "62%", delay: 0.5, seed: 3 },
  { label: "Events ping", sub: "Weekend anime night", left: "72%", top: "58%", delay: 0.65, seed: 4 },
] as const;

function FloatingHeroCard({
  item,
}: {
  item: (typeof FLOATERS)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const magX = useMotionValue(0);
  const magY = useMotionValue(0);
  const tilt = 9;

  const rotateX = useSpring(
    useTransform(my, [-0.5, 0.5], [tilt, -tilt]),
    { stiffness: 260, damping: 24 }
  );
  const rotateY = useSpring(
    useTransform(mx, [-0.5, 0.5], [-tilt, tilt]),
    { stiffness: 260, damping: 24 }
  );
  const smx = useSpring(magX, { stiffness: 300, damping: 24 });
  const smy = useSpring(magY, { stiffness: 300, damping: 24 });

  const shadow = useTransform([mx, my], ([px, py]) => {
    const p = Math.min(1, Math.abs(px as number) + Math.abs(py as number));
    return `0 ${12 + p * 22}px ${34 + p * 40}px rgba(0,0,0,${0.34 + p * 0.24}), 0 0 ${22 + p * 44}px rgba(92,243,255,${0.1 + p * 0.18})`;
  });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    magX.set((e.clientX - cx) * 0.14);
    magY.set((e.clientY - cy) * 0.14);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    magX.set(0);
    magY.set(0);
  };

  const dx = [0, 5 + item.seed, -4, 3, 0];
  const dy = [0, -4, 5, -3, 0];

  return (
    <motion.div
      className="absolute w-48"
      style={{ left: item.left, top: item.top }}
      animate={
        reduce
          ? undefined
          : {
              x: dx,
              y: dy,
            }
      }
      transition={{
        duration: 16 + item.seed * 2.5,
        repeat: reduce ? 0 : Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        ref={ref}
        data-cursor-glow="strong"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: item.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          x: smx,
          y: smy,
          transformPerspective: 820,
          boxShadow: reduce ? undefined : shadow,
        }}
        className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-neon-cyan/90">
          {item.label}
        </p>
        <p className="mt-1 text-xs text-white/60">{item.sub}</p>
      </motion.div>
    </motion.div>
  );
}

/** Foreground UI layer at 1.5× scroll (translateY) vs page content at 1×. */
function HeroFloaters() {
  const fgY = useMotionValue(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      fgY.set(0);
      return;
    }
    const applyFg = () => {
      const burst = isScrollBurstActive() ? 1.48 : 1;
      fgY.set(useScrollStore.getState().scrollY * 1.5 * burst);
    };
    applyFg();
    let raf = 0;
    const tickBurst = () => {
      applyFg();
      if (isScrollBurstActive()) {
        raf = requestAnimationFrame(tickBurst);
      }
    };
    const unsub = useScrollStore.subscribe(() => {
      applyFg();
      if (isScrollBurstActive()) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tickBurst);
      }
    });
    return () => {
      unsub();
      cancelAnimationFrame(raf);
    };
  }, [fgY, reduce]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[5] hidden md:block"
      style={{ y: reduce ? 0 : fgY }}
      aria-hidden
    >
      {FLOATERS.map((it) => (
        <div key={it.label} className="pointer-events-auto">
          <FloatingHeroCard item={it} />
        </div>
      ))}
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative z-[5] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-night/30 via-transparent to-night" />
      <HeroFloaters />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-28 text-center md:pb-32 md:pt-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.22em] text-neon-purple/95 backdrop-blur-md"
        >
          Discord community
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
        >
          <span className="text-gradient drop-shadow-[0_0_32px_rgba(179,102,255,0.28)]">
            Welcome to OwO Paradise
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14 }}
          className="mt-4 max-w-xl text-base text-white/75 md:text-lg"
        >
          Your ultimate anime Discord community
        </motion.p>

        <MagneticButton
          href={invite}
          target="_blank"
          rel="noreferrer"
          strength={0.28}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto relative mt-10 inline-flex items-center justify-center rounded-full bg-[#5865F2] px-12 py-3.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(88,101,242,0.45)] transition hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_16px_48px_rgba(147,197,253,0.35)]"
        >
          Join Server
        </MagneticButton>
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      >
        <div className="h-9 w-5 rounded-full border border-white/20 bg-white/[0.04] backdrop-blur-sm">
          <div className="mx-auto mt-2 h-1 w-1 rounded-full bg-neon-purple/90" />
        </div>
      </motion.div>
    </section>
  );
}
