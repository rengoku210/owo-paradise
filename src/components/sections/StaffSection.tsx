"use client";

import Image from "next/image";
import { useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionReveal } from "@/components/animations/SectionReveal";
import { MagneticTiltCard } from "@/components/ui/MagneticTiltCard";

type StaffMember = {
  role: string;
  username: string;
  seed: string;
};

const STAFF: StaffMember[] = [
  { role: "Owner", username: "SakuraNeko", seed: "owner-owo" },
  { role: "Co-owner", username: "MochiMoon", seed: "co-owo" },
  { role: "Payout Manager", username: "LuckyLapis", seed: "payout-owo" },
];

function StaffCardInner({ member }: { member: StaffMember }) {
  const ref = useRef<HTMLDivElement>(null);

  const avatar = `https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=${encodeURIComponent(
    member.seed
  )}`;

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--x", `${((e.clientX - el.getBoundingClientRect().left) / el.offsetWidth) * 100}%`);
    el.style.setProperty("--y", `${((e.clientY - el.getBoundingClientRect().top) / el.offsetHeight) * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (el) {
      el.style.setProperty("--x", "50%");
      el.style.setProperty("--y", "50%");
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative rounded-2xl p-6"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-white/15 ring-2 ring-neon-pink/20 transition group-hover:ring-neon-cyan/35">
          <Image
            src={avatar}
            alt=""
            width={80}
            height={80}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
        <p className="mt-4 font-display text-base font-semibold">{member.username}</p>
        <span className="mt-2 inline-flex rounded-full border border-neon-purple/35 bg-neon-purple/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-neon-purple/95">
          {member.role}
        </span>
      </div>
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x,50%) var(--y,50%), rgba(255,75,212,0.1), transparent 50%)",
        }}
        aria-hidden
      />
    </div>
  );
}

export function StaffSection() {
  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28">
      <SectionReveal className="mx-auto max-w-5xl" delay={0.15} layerZ={24}>
        <GlassPanel className="p-8 md:p-12">
          <div className="mb-10 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-pink/90">
              Team
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Staff <span className="text-gradient">you’ll actually recognize</span>
            </h2>
            <p className="mt-3 text-sm text-white/60">
              Swap avatars for Discord CDN URLs anytime — structure stays the same.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {STAFF.map((m, i) => (
              <motion.div
                key={m.role}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ delay: i * 0.09, duration: 0.42, ease: "easeOut" }}
              >
                <MagneticTiltCard
                  className="rounded-2xl border border-white/10 bg-white/[0.035] shadow-lg backdrop-blur-xl"
                  tiltStrength={7}
                  magneticStrength={0.11}
                >
                  <StaffCardInner member={m} />
                </MagneticTiltCard>
              </motion.div>
            ))}
          </div>
        </GlassPanel>
      </SectionReveal>
    </section>
  );
}
