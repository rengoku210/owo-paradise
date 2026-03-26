"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { MagneticTiltCard } from "@/components/ui/MagneticTiltCard";

const CARDS = [
  {
    title: "Earn Gold",
    body: "Run /collect loops, chain boosts, and funnel gains into compounding growth.",
    icon: "🪙",
    chip: "+240 G/min",
  },
  {
    title: "Build Army",
    body: "Train balanced squads and push timed strikes when your economy peaks.",
    icon: "⚔️",
    chip: "Infantry • Siege • Cavalry",
  },
  {
    title: "Bank System",
    body: "Deposit aggressively and let passive interest create a permanent lead.",
    icon: "🏦",
    chip: "Passive yield online",
  },
  {
    title: "Strategy",
    body: "Outmaneuver rivals with smart timing, resource denial, and map pressure.",
    icon: "♟️",
    chip: "Ranked competitive play",
  },
] as const;

export function FeaturesSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28">
      <SectionReveal className="mx-auto max-w-6xl" delay={0.2} layerZ={26}>
        <GlassPanel className="p-8 md:p-12">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-empire-pearl">Why join Empire Force</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">A dashboard built for <span className="text-gradient">addictive progression</span></h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {CARDS.map((card, i) => (
              <MagneticTiltCard
                key={card.title}
                className="group relative overflow-hidden rounded-3xl border border-empire-gold/25 bg-white/[0.045] p-6 shadow-[0_20px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                tiltStrength={reduce ? 0 : 7}
                magneticStrength={reduce ? 0 : 0.08}
                uiSound
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-empire-gold/[0.12] to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-center justify-between">
                    <span className="text-3xl">{card.icon}</span>
                    <span className="rounded-full border border-empire-gold/25 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-wider text-empire-pearl">{card.chip}</span>
                  </div>
                  <h3 className="relative mt-4 font-display text-xl font-semibold">{card.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-white/70">{card.body}</p>

                  {card.title === "Earn Gold" && !reduce && (
                    <motion.div
                      className="relative mt-4 h-6 overflow-hidden rounded-lg border border-empire-gold/20 bg-black/25"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                    >
                      <motion.div
                        className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-empire-gold/40 to-transparent"
                        animate={{ x: ["-30%", "160%"] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </MagneticTiltCard>
            ))}
          </div>
        </GlassPanel>
      </SectionReveal>
    </section>
  );
}
