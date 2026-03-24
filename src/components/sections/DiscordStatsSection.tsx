"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { AnimatedStat } from "@/components/animations/AnimatedStat";
import { SessionJoinStat } from "@/components/animations/SessionJoinStat";
import { useDiscordStats } from "@/hooks/useDiscordStats";
import { MagneticTiltCard } from "@/components/ui/MagneticTiltCard";

export function DiscordStatsSection() {
  const { data, error, sessionJoins } = useDiscordStats();
  const total = data?.total ?? 0;
  const online = data?.online ?? 0;

  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28">
      <SectionReveal className="mx-auto max-w-5xl" delay={0.05} layerZ={20}>
        <GlassPanel className="relative overflow-hidden p-8 md:p-12">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-neon-purple/18 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-neon-pink/12 blur-3xl"
            aria-hidden
          />

          <div className="relative flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan/85">
                Live server pulse
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
                Stats that <span className="text-gradient">feel alive</span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
                Member totals refresh from your API route. The “session joins” counter adds up whenever
                the server total grows between polls while this page stays open.
              </p>
              {error && (
                <p className="mt-2 text-xs text-amber-300/90">Could not refresh: {error}</p>
              )}
              {data?.hint && (
                <p className="mt-2 text-xs text-white/45">{data.hint}</p>
              )}
            </div>

            <div className="grid w-full max-w-xl gap-4 sm:grid-cols-3">
              {[
                {
                  key: "total",
                  className:
                    "rounded-2xl border border-neon-pink/25 bg-gradient-to-br from-white/[0.08] to-transparent p-5 backdrop-blur-md",
                  body: (
                    <>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                        Total members
                      </p>
                      <p className="mt-2 font-display text-3xl font-bold text-neon-pink tabular-nums md:text-4xl">
                        <AnimatedStat key={`t-${total}`} value={total} />
                      </p>
                    </>
                  ),
                },
                {
                  key: "online",
                  className:
                    "rounded-2xl border border-neon-cyan/25 bg-gradient-to-br from-white/[0.08] to-transparent p-5 backdrop-blur-md",
                  body: (
                    <>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                        Online now
                      </p>
                      <p className="mt-2 font-display text-3xl font-bold text-neon-cyan tabular-nums md:text-4xl">
                        <AnimatedStat key={`o-${online}`} value={online} />
                      </p>
                    </>
                  ),
                },
                {
                  key: "joins",
                  className:
                    "rounded-2xl border border-neon-purple/30 bg-gradient-to-br from-white/[0.08] to-transparent p-5 backdrop-blur-md",
                  body: (
                    <>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                        Joins (session)
                      </p>
                      <p className="mt-2 font-display text-3xl font-bold text-white tabular-nums md:text-4xl">
                        <SessionJoinStat value={sessionJoins} />
                      </p>
                      <p className="mt-2 text-[10px] text-white/40">Detected via polling</p>
                    </>
                  ),
                },
              ].map((card, i) => (
                <motion.div
                  key={card.key}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-6% 0px" }}
                  transition={{ delay: i * 0.085, duration: 0.42, ease: "easeOut" }}
                >
                  <MagneticTiltCard
                    className={card.className}
                    tiltStrength={6}
                    magneticStrength={0.09}
                    uiSound
                  >
                    {card.body}
                  </MagneticTiltCard>
                </motion.div>
              ))}
            </div>
          </div>

          <p className="relative mt-8 text-[10px] uppercase tracking-widest text-white/30">
            Source: {data?.source ?? "…"}
          </p>
        </GlassPanel>
      </SectionReveal>
    </section>
  );
}
