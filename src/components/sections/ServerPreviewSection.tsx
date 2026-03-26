"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionReveal } from "@/components/animations/SectionReveal";

const COMMANDS = [
  { cmd: "/collect", out: "Resources collected" },
  { cmd: "/bank", out: "Bank deposit" },
  { cmd: "/build", out: "Construction queue updated" },
];

const PLAYERS = ["IronWolf", "NovaKing", "AshVanguard", "RexPrime", "GoldTactician", "SilentForge", "TitanRook"];
const FEED_EVENTS = [
  () => `${PLAYERS[Math.floor(Math.random() * PLAYERS.length)]} collected ${Math.floor(Math.random() * 6 + 3) * 100} gold`,
  () => `${PLAYERS[Math.floor(Math.random() * PLAYERS.length)]} upgraded army barracks`,
  () => `${PLAYERS[Math.floor(Math.random() * PLAYERS.length)]} received bank interest credit`,
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ServerPreviewSection() {
  const [feed, setFeed] = useState<string[]>([
    "IronWolf collected 500 gold",
    "NovaKing upgraded army barracks",
    "AshVanguard received bank interest credit",
  ]);

  useEffect(() => {
    let timeoutId: number;

    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        const next = FEED_EVENTS[rand(0, FEED_EVENTS.length - 1)]();
        setFeed((prev) => [next, ...prev].slice(0, 6));
        schedule();
      }, rand(3000, 5000));
    };

    schedule();
    return () => window.clearTimeout(timeoutId);
  }, []);

  const feedItems = useMemo(() => feed, [feed]);

  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28">
      <SectionReveal className="mx-auto max-w-6xl" delay={0.1} layerZ={22}>
        <GlassPanel className="p-6 md:p-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-empire-pearl">Command preview</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Empire Force <span className="text-gradient">operations feed</span>
            </h2>
            <p className="mt-2 text-sm text-white/60">Command examples plus simulated live activity updates from the empire realm.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="grid gap-4">
              {COMMANDS.map((entry, i) => (
                <motion.div key={entry.cmd} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ delay: i * 0.1, duration: 0.4 }} className="rounded-2xl border border-empire-gold/20 bg-white/[0.04] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  <p className="font-mono text-sm text-empire-pearl">{entry.cmd}</p>
                  <p className="mt-1 text-sm text-white/72">→ {entry.out}</p>
                </motion.div>
              ))}
            </div>

            <div className="rounded-2xl border border-empire-gold/20 bg-white/[0.03] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-empire-pearl">Activity feed</p>
              <div className="mt-4 space-y-2">
                {feedItems.map((item, idx) => (
                  <motion.p
                    key={`${item}-${idx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/75"
                  >
                    {item}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </GlassPanel>
      </SectionReveal>
    </section>
  );
}
