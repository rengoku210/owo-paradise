"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionReveal } from "@/components/animations/SectionReveal";

const CHANNELS = [
  { name: "welcome", type: "text" as const },
  { name: "announcements", type: "text" as const },
  { name: "general", type: "text" as const, active: true },
  { name: "anime-nights", type: "text" as const },
  { name: "art-share", type: "text" as const },
  { name: "Karaoke Lounge", type: "voice" as const },
];

const MESSAGES = [
  { user: "MochiMoon", color: "bg-[#e879f9]", text: "OwO what's this? New banner looks so clean ✨" },
  { user: "SakuraNeko", color: "bg-[#60a5fa]", text: "Reminder: movie night starts in 1 hour — #anime-nights" },
  { user: "LuckyLapis", color: "bg-[#34d399]", text: "Payout proofs are pinned in #rules — ty for supporting the server 💜" },
];

const MEMBERS = [
  { name: "SakuraNeko", status: "online", role: "Owner" },
  { name: "MochiMoon", status: "online", role: "Co-owner" },
  { name: "LuckyLapis", status: "idle", role: "Payout Mgr" },
  { name: "VelvetVoid", status: "dnd", role: "Member" },
  { name: "KaitoBytes", status: "online", role: "Member" },
  { name: "NekoNoodle", status: "offline", role: "Member" },
];

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    online: "bg-emerald-400",
    idle: "bg-amber-400",
    dnd: "bg-rose-500",
    offline: "bg-zinc-500",
  };
  return (
    <span
      className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#2b2d31] ${map[status] ?? "bg-zinc-500"}`}
    />
  );
}

/**
 * Stylized Discord chrome — not pixel-perfect, but reads instantly as “server preview”.
 */
export function ServerPreviewSection() {
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => setTyping((t) => !t), 5200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative px-4 py-20 md:px-8 md:py-28">
      <SectionReveal className="mx-auto max-w-6xl" delay={0.1} layerZ={22}>
        <GlassPanel className="overflow-hidden p-6 md:p-10">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-purple/90">
              Server preview
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Peek inside <span className="text-gradient">OwO Paradise</span>
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Sample channels and messages — swap copy to match your real layout.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/40 bg-[#313338] shadow-2xl ring-1 ring-white/5">
            <header className="flex h-12 items-center border-b border-black/30 px-4 text-sm font-semibold text-white shadow-sm">
              <span className="truncate">OwO Paradise</span>
              <span className="ml-2 text-xs font-normal text-white/45">#general</span>
            </header>

            <div className="flex min-h-[420px]">
              {/* Channel sidebar */}
              <aside className="hidden w-[220px] shrink-0 border-r border-black/35 bg-[#2b2d31] px-2 py-3 text-[13px] text-[#949ba4] md:block">
                <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[#6d7278]">
                  Text channels
                </p>
                <ul className="space-y-0.5">
                  {CHANNELS.filter((c) => c.type === "text").map((c) => (
                    <li key={c.name}>
                      <span
                        className={`flex items-center gap-2 rounded px-2 py-1.5 ${
                          c.active
                            ? "bg-[#3f4248] text-white"
                            : "hover:bg-[#35373c] hover:text-[#dbdee1]"
                        }`}
                      >
                        <span className="text-[#80848e]">#</span>
                        {c.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[#6d7278]">
                  Voice
                </p>
                <ul>
                  {CHANNELS.filter((c) => c.type === "voice").map((c) => (
                    <li key={c.name}>
                      <span className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-[#35373c]">
                        <span className="text-[#80848e]">🔊</span>
                        {c.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Chat */}
              <div className="flex min-w-0 flex-1 flex-col bg-[#313338]">
                <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
                  {MESSAGES.map((m, i) => (
                    <motion.div
                      key={m.user + m.text}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-5%" }}
                      transition={{ delay: i * 0.095, duration: 0.45, ease: "easeOut" }}
                      className="flex gap-3"
                    >
                      <div
                        className={`mt-0.5 h-10 w-10 shrink-0 rounded-full ${m.color}`}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {m.user}{" "}
                          <span className="text-xs font-normal text-[#949ba4]">Today</span>
                        </p>
                        <p className="text-[15px] leading-snug text-[#dbdee1]">{m.text}</p>
                      </div>
                    </motion.div>
                  ))}

                  <AnimatePresence>
                    {typing && (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        className="flex items-center gap-2 pl-[52px] text-xs text-[#949ba4]"
                      >
                        <span className="font-medium text-[#dbdee1]">NekoNoodle</span>
                        <span>is typing</span>
                        <span className="flex gap-1">
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              className="h-1.5 w-1.5 rounded-full bg-[#949ba4]"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.1,
                                delay: d * 0.18,
                              }}
                            />
                          ))}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="border-t border-black/35 bg-[#383a40] px-4 py-3">
                  <div className="rounded-lg bg-[#404249] px-4 py-2.5 text-sm text-[#6d7278]">
                    Message #general
                  </div>
                </div>
              </div>

              {/* Members */}
              <aside className="hidden w-[200px] shrink-0 border-l border-black/35 bg-[#2b2d31] py-3 pl-3 pr-2 text-[13px] lg:block">
                <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[#6d7278]">
                  Online — {MEMBERS.filter((m) => m.status !== "offline").length}
                </p>
                <ul className="space-y-2">
                  {MEMBERS.map((m) => (
                    <li key={m.name} className="flex items-center gap-2 px-2 text-[#dbdee1]">
                      <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-xs font-bold text-white">
                        {m.name.slice(0, 1)}
                        <StatusDot status={m.status} />
                      </span>
                      <span className="min-w-0 truncate text-sm">{m.name}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </GlassPanel>
      </SectionReveal>
    </section>
  );
}
