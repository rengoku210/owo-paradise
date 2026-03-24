"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { MagneticTiltCard } from "@/components/ui/MagneticTiltCard";

const ZONES = [
  {
    title: "Promotions",
    body: "Creator spotlights, partner drops, and soft launches — announced cleanly so nobody misses the hype.",
    icon: "✨",
    accent: "from-neon-pink/28 to-transparent",
  },
  {
    title: "Events",
    body: "Watch parties, seasonal themes, and community milestones with calendar-friendly pings.",
    icon: "🎉",
    accent: "from-neon-purple/28 to-transparent",
  },
  {
    title: "Community",
    body: "Welcoming intros, helpful regulars, and mods who keep chat readable (and kind).",
    icon: "🌸",
    accent: "from-sky-400/20 to-transparent",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28">
      <SectionReveal className="mx-auto max-w-6xl" delay={0.2} layerZ={26}>
        <GlassPanel className="p-8 md:p-12">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan/90">
                Why stay
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
                Built for <span className="text-gradient">anime nights & good vibes</span>
              </h2>
            </div>
            <p className="max-w-md text-sm text-white/60">
              Floating glass cards — subtle motion, zero gimmicks.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ZONES.map((z, i) => (
              <MagneticTiltCard
                key={z.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
                tiltStrength={8}
                magneticStrength={0.1}
                uiSound
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ delay: i * 0.088, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${z.accent} opacity-55 transition group-hover:opacity-100`}
                    aria-hidden
                  />
                  <motion.span
                    className="relative inline-block text-3xl"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5 + i * 0.3, ease: "easeInOut" }}
                  >
                    {z.icon}
                  </motion.span>
                  <h3 className="relative mt-4 font-display text-lg font-semibold">{z.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-white/65">{z.body}</p>
                </motion.div>
              </MagneticTiltCard>
            ))}
          </div>
        </GlassPanel>
      </SectionReveal>
    </section>
  );
}
