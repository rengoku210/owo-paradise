"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { MagneticTiltCard } from "@/components/ui/MagneticTiltCard";

type EconomyState = {
  gold: number;
  bank: number;
  interest: number;
  players: number;
};

const BASE_ECONOMY: EconomyState = {
  gold: 912450,
  bank: 382900,
  interest: 12480,
  players: 1843,
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function LiveValue({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    const duration = 700;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{display.toLocaleString()}</>;
}

export function DiscordStatsSection() {
  const reduce = useReducedMotion();
  const [economy, setEconomy] = useState<EconomyState>(BASE_ECONOMY);

  useEffect(() => {
    let goldTimer: number;

    const scheduleGoldTick = () => {
      goldTimer = window.setTimeout(() => {
        setEconomy((prev) => ({
          ...prev,
          gold: prev.gold + rand(90, 260),
          interest: prev.interest + rand(3, 11),
        }));
        scheduleGoldTick();
      }, rand(2000, 4000));
    };

    scheduleGoldTick();

    const bankTimer = window.setInterval(() => {
      setEconomy((prev) => {
        const growth = Math.max(16, Math.round(prev.bank * 0.0035));
        return {
          ...prev,
          bank: prev.bank + growth,
          interest: prev.interest + Math.max(1, Math.round(growth * 0.09)),
        };
      });
    }, 3300);

    const playerTimer = window.setInterval(() => {
      setEconomy((prev) => ({
        ...prev,
        players: clamp(prev.players + rand(-3, 4), 1760, 1980),
      }));
    }, 2800);

    return () => {
      window.clearInterval(goldTimer);
      window.clearInterval(bankTimer);
      window.clearInterval(playerTimer);
    };
  }, []);

  const economyStats = useMemo(
    () => [
      { key: "gold", label: "Gold in circulation", value: economy.gold, suffix: " G" },
      { key: "bank", label: "Bank reserves", value: economy.bank, suffix: " G" },
      { key: "interest", label: "Interest paid today", value: economy.interest, suffix: " G" },
      { key: "players", label: "Active players", value: economy.players, suffix: "" },
    ],
    [economy],
  );

  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28">
      <SectionReveal className="mx-auto max-w-6xl" delay={0.05} layerZ={20}>
        <GlassPanel className="p-8 md:p-12">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-empire-pearl">Economy system</p>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
                Empire resource <span className="text-gradient">control center</span>
              </h2>
            </div>
            <p className="max-w-md text-sm text-white/60">Simulated live values update with subtle, believable variation.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {economyStats.map((item, i) => (
              <motion.div key={item.key} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-6% 0px" }} transition={{ delay: i * 0.08, duration: 0.42, ease: "easeOut" }}>
                <MagneticTiltCard className="group relative overflow-hidden rounded-2xl border border-empire-gold/25 bg-white/[0.045] p-5 backdrop-blur-xl" tiltStrength={reduce ? 0 : 6} magneticStrength={reduce ? 0 : 0.08} uiSound>
                  {!reduce &&
                    [0, 1, 2].map((p) => (
                      <motion.span
                        key={p}
                        className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-empire-gold/70"
                        style={{ left: `${18 + p * 28}%`, top: `${20 + p * 18}%` }}
                        animate={{ y: [0, -8, 0], opacity: [0.35, 0.95, 0.35] }}
                        transition={{ repeat: Infinity, duration: 2 + p * 0.35, delay: p * 0.2 }}
                      />
                    ))}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-empire-gold/[0.11] to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">{item.label}</p>
                  <p className="relative mt-2 font-display text-3xl font-bold text-empire-pearl tabular-nums transition-transform duration-300 group-hover:scale-[1.02] md:text-4xl">
                    <span className="gold-shimmer inline-block">
                      <LiveValue value={item.value} />
                    </span>
                    <span className="text-base text-empire-gold/90">{item.suffix}</span>
                  </p>
                </MagneticTiltCard>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </SectionReveal>
    </section>
  );
}
