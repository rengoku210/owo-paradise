"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { MagneticTiltCard } from "@/components/ui/MagneticTiltCard";

const STAFF = [
  { role: "High Commander", username: "Aurelius", seed: "empire-1" },
  { role: "Treasury Chief", username: "Valen", seed: "empire-2" },
  { role: "War Marshal", username: "Kael", seed: "empire-3" },
];

export function StaffSection() {
  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28">
      <SectionReveal className="mx-auto max-w-5xl" delay={0.15} layerZ={24}>
        <GlassPanel className="p-8 md:p-12">
          <div className="mb-10 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-empire-pearl">Leadership</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Empire Force <span className="text-gradient">command</span></h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {STAFF.map((m, i) => (
              <motion.div key={m.role} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8% 0px" }} transition={{ delay: i * 0.09, duration: 0.42 }}>
                <MagneticTiltCard className="rounded-2xl border border-empire-gold/20 bg-white/[0.04] p-6 text-center shadow-lg backdrop-blur-xl" tiltStrength={7} magneticStrength={0.11}>
                  <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border border-empire-gold/30">
                    <Image src={`https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=${encodeURIComponent(m.seed)}`} alt="" width={80} height={80} className="h-full w-full" unoptimized />
                  </div>
                  <p className="mt-4 font-display text-base font-semibold">{m.username}</p>
                  <span className="mt-2 inline-flex rounded-full border border-empire-gold/35 bg-empire-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-empire-pearl">{m.role}</span>
                </MagneticTiltCard>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </SectionReveal>
    </section>
  );
}
