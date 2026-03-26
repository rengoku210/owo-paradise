"use client";

import { SectionReveal } from "@/components/animations/SectionReveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

const invite = "https://discord.gg/959cmX7YJn";

export function FinalCTASection() {
  return (
    <section className="relative px-4 py-20 md:px-8 md:pb-32">
      <SectionReveal className="mx-auto max-w-3xl" delay={0.25} layerZ={28}>
        <div className="relative overflow-hidden rounded-[2rem] border border-empire-gold/20 bg-white/[0.05] px-8 py-14 text-center shadow-[0_0_60px_rgba(212,175,55,0.14)] backdrop-blur-xl md:px-14 md:py-16">
          <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-white/50">Ready to mobilize</p>
          <h2 className="relative mt-3 font-display text-3xl font-bold md:text-4xl">Join Empire Force</h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm text-white/65">Enter the command server and start building your empire economy now.</p>

          <MagneticButton href={invite} target="_blank" rel="noreferrer" strength={0.26} className="relative mt-8 inline-flex items-center justify-center rounded-full bg-empire-gold px-12 py-4 text-sm font-semibold text-black shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_50px_rgba(212,175,55,0.45)] transition hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_24px_60px_rgba(212,175,55,0.38)]">
            Open Empire invite
          </MagneticButton>
        </div>
      </SectionReveal>
    </section>
  );
}
