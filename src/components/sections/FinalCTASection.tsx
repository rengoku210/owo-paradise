"use client";

import { SectionReveal } from "@/components/animations/SectionReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

const invite =
  process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "https://discord.com/channels/@me";

export function FinalCTASection() {
  return (
    <section className="relative px-4 py-20 md:px-8 md:pb-32">
      <SectionReveal className="mx-auto max-w-3xl" delay={0.25} layerZ={28}>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.05] px-8 py-14 text-center shadow-[0_0_60px_rgba(179,102,255,0.15)] backdrop-blur-xl md:px-14 md:py-16">
          <div
            className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-neon-pink/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-neon-cyan/15 blur-3xl"
            aria-hidden
          />

          <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
            Ready when you are
          </p>
          <h2 className="relative mt-3 font-display text-3xl font-bold md:text-4xl">
            Join OwO Paradise
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm text-white/65">
            Grab a role, say hi in general, and settle into the soft neon glow of the lounge.
          </p>

          <MagneticButton
            href={invite}
            target="_blank"
            rel="noreferrer"
            strength={0.26}
            className="relative mt-8 inline-flex items-center justify-center rounded-full bg-[#5865F2] px-12 py-4 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_50px_rgba(88,101,242,0.45)] transition hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_24px_60px_rgba(167,139,250,0.35)]"
          >
            Open Discord invite
          </MagneticButton>
        </div>
      </SectionReveal>
    </section>
  );
}
