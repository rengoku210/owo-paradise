"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionReveal } from "@/components/animations/SectionReveal";

type ProfileState = {
  level: number;
  hp: number;
  hpMax: number;
  gold: number;
  food: number;
  stone: number;
  army: number;
};

const BASE_PROFILE: ProfileState = {
  level: 28,
  hp: 740,
  hpMax: 1000,
  gold: 16500,
  food: 380,
  stone: 620,
  army: 240,
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function Meter({ label, value, max }: { label: string; value: number; max: number }) {
  const reduce = useReducedMotion();
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-white/65">
        <span>{label}</span>
        <span>
          {value.toLocaleString()} / {max.toLocaleString()}
        </span>
      </div>
      <div className="h-2 rounded-full bg-black/35">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-empire-bronze to-empire-gold"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function PlayerProfileSection() {
  const [profile, setProfile] = useState(BASE_PROFILE);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProfile((prev) => ({
        ...prev,
        hp: clamp(prev.hp + rand(-12, 10), 640, prev.hpMax),
        gold: clamp(prev.gold + rand(60, 190), 15000, 26000),
        food: clamp(prev.food + rand(-5, 8), 300, 520),
        stone: clamp(prev.stone + rand(-4, 7), 520, 760),
        army: clamp(prev.army + rand(-2, 3), 220, 320),
      }));
    }, 3600);

    return () => window.clearInterval(id);
  }, []);

  const statItems = useMemo(
    () => [
      { icon: "🪙", label: "Gold", value: profile.gold.toLocaleString() },
      { icon: "🌾", label: "Food", value: profile.food },
      { icon: "🪨", label: "Stone", value: profile.stone },
      { icon: "⚔️", label: "Army", value: profile.army },
    ],
    [profile],
  );

  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28">
      <SectionReveal className="mx-auto max-w-5xl" delay={0.12} layerZ={23}>
        <GlassPanel className="p-7 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-empire-pearl">Player profile</p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Commander status <span className="text-gradient">embed</span>
          </h2>

          <div className="mt-8 rounded-2xl border border-empire-gold/25 bg-[#11141a]/85 p-5 shadow-[0_20px_55px_rgba(0,0,0,0.45)]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-empire-gold text-xs font-bold text-black">EF</div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-empire-pearl">Empire Force • Commander Profile</p>
                <p className="text-sm text-white/60">Level {profile.level} strategist</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <Meter label="HP" value={profile.hp} max={profile.hpMax} />
              <Meter label="Army strength" value={profile.army} max={400} />
            </div>

            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {statItems.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-empire-gold/35 hover:bg-white/[0.06] hover:shadow-[0_10px_24px_rgba(212,175,55,0.15)]">
                  <span className="mr-1">{item.icon}</span>
                  {item.label}: <span className="text-empire-pearl">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassPanel>
      </SectionReveal>
    </section>
  );
}
