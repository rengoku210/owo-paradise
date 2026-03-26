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
    loading: () => <div className="absolute inset-0 bg-gradient-to-b from-ink via-night to-night" />,
  }
);

const invite = "https://discord.gg/959cmX7YJn";

const FLOATERS = [
  { label: "Imperial Orders", sub: "Daily updates", left: "-6%", top: "18%", delay: 0.2, seed: 1 },
  { label: "War Room", sub: "Strategic council", left: "78%", top: "22%", delay: 0.35, seed: 2 },
  { label: "Trade Hub", sub: "Gold routing", left: "8%", top: "62%", delay: 0.5, seed: 3 },
  { label: "Field Ops", sub: "Raid windows", left: "72%", top: "58%", delay: 0.65, seed: 4 },
] as const;

function FloatingHeroCard({ item }: { item: (typeof FLOATERS)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const magX = useMotionValue(0);
  const magY = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 260, damping: 24 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 260, damping: 24 });
  const smx = useSpring(magX, { stiffness: 300, damping: 24 });
  const smy = useSpring(magY, { stiffness: 300, damping: 24 });

  const shadow = useTransform([mx, my], ([px, py]) => {
    const p = Math.min(1, Math.abs(px as number) + Math.abs(py as number));
    return `0 ${12 + p * 22}px ${34 + p * 40}px rgba(0,0,0,${0.34 + p * 0.24}), 0 0 ${22 + p * 44}px rgba(212,175,55,${0.1 + p * 0.18})`;
  });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    magX.set((e.clientX - (r.left + r.width / 2)) * 0.14);
    magY.set((e.clientY - (r.top + r.height / 2)) * 0.14);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    magX.set(0);
    magY.set(0);
  };

  return (
    <motion.div
      className="absolute w-48"
      style={{ left: item.left, top: item.top }}
      animate={reduce ? undefined : { x: [0, 5 + item.seed, -4, 3, 0], y: [0, -4, 5, -3, 0] }}
      transition={{ duration: 16 + item.seed * 2.5, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: item.delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, x: smx, y: smy, transformPerspective: 820, boxShadow: reduce ? undefined : shadow }}
        className="rounded-2xl border border-empire-gold/20 bg-white/[0.05] px-4 py-3 backdrop-blur-md"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-empire-pearl">{item.label}</p>
        <p className="mt-1 text-xs text-white/65">{item.sub}</p>
      </motion.div>
    </motion.div>
  );
}

function HeroFloaters() {
  const fgY = useMotionValue(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const applyFg = () => fgY.set(useScrollStore.getState().scrollY * 1.5 * (isScrollBurstActive() ? 1.48 : 1));
    applyFg();
    let raf = 0;
    const tickBurst = () => {
      applyFg();
      if (isScrollBurstActive()) raf = requestAnimationFrame(tickBurst);
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
    <motion.div className="pointer-events-none absolute inset-0 z-[5] hidden md:block" style={{ y: reduce ? 0 : fgY }} aria-hidden>
      {FLOATERS.map((it) => (
        <div key={it.label} className="pointer-events-auto">
          <FloatingHeroCard item={it} />
        </div>
      ))}
    </motion.div>
  );
}

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative z-[5] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-night/35 via-transparent to-night" />
      <div className="pointer-events-none absolute -left-24 top-20 z-[2] h-72 w-72 rounded-full bg-empire-gold/12 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 z-[2] h-80 w-80 rounded-full bg-empire-pearl/10 blur-3xl" />
      <HeroFloaters />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-28 text-center md:pb-32 md:pt-32">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="mb-4 rounded-full border border-empire-gold/30 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.22em] text-empire-pearl backdrop-blur-md">
          Elite command network
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.06 }} className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-gradient drop-shadow-[0_0_26px_rgba(212,175,55,0.35)]">Empire Force</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.14 }} className="mt-4 max-w-xl text-base text-white/75 md:text-lg">
          Build. Dominate. Earn.
        </motion.p>



        {!reduce && (
          <div className="pointer-events-none mt-6 flex gap-2" aria-hidden>
            {[0, 1, 2, 3, 4].map((n) => (
              <motion.span
                key={n}
                className="h-1.5 w-1.5 rounded-full bg-empire-gold/75"
                animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.6 + n * 0.25, delay: n * 0.12 }}
              />
            ))}
          </div>
        )}

        <MagneticButton href={invite} target="_blank" rel="noreferrer" strength={0.28} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.55 }} className="pointer-events-auto relative mt-10 inline-flex items-center justify-center rounded-full bg-empire-gold px-12 py-3.5 text-sm font-semibold text-[#111] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_12px_40px_rgba(212,175,55,0.45)] transition hover:shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_16px_48px_rgba(212,175,55,0.5)]">
          Join Empire Force
        </MagneticButton>
      </div>
    </section>
  );
}
