"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ReplyMap = Record<string, string[]>;

const BOT_RESPONSES: ReplyMap = {
  gold: [
    "Stack income by cycling /collect, then secure gains with /bank before spending.",
    "Gold flow wins wars: collect on cooldown and park surplus in bank for safety.",
    "Treat raw gold as fuel—collect fast, bank often, invest only when returns are clear.",
  ],
  army: [
    "Train in controlled waves so upkeep never crushes your economy.",
    "Build army after income stabilizes—discipline beats brute force.",
    "Upgrade barracks first, then scale units with a reserve buffer.",
  ],
  strategy: [
    "Economy first, map pressure second, full conflict last. Timing is everything.",
    "Play for compounding advantages, not flashy early battles.",
    "Own the bank curve, then dictate engagements on your terms.",
  ],
  "best strategy": [
    "Open with banking upgrades and protect momentum before expanding military.",
    "Win through tempo: steady income, measured expansion, decisive strikes.",
    "The best strategy is boring at first—compound resources, then overwhelm.",
  ],
  "how to grow fast": [
    "Run /collect nonstop, deposit quickly, and reinvest into production upgrades.",
    "Trim waste, boost income engines, and let passive growth do the heavy lifting.",
    "Grow fast by protecting every gain—banking discipline outpaces risky pushes.",
  ],
  "earn gold fast": [
    "Pair /collect with economy boosts and avoid overcommitting to early army costs.",
    "Fast gold comes from consistency: collect, bank, repeat.",
    "Prioritize income multipliers, then cycle commands with zero idle time.",
  ],
};

const FALLBACK = [
  "Give me a target: gold, army, strategy, best strategy, how to grow fast, or earn gold fast.",
  "Be specific, commander. I can brief you on gold, army, and scaling strategy.",
  "Ask one directive at a time. I respond best to tactical keywords.",
];

function pickResponse(options: string[], last: number) {
  if (options.length <= 1) return { text: options[0], index: 0 };
  let index = Math.floor(Math.random() * options.length);
  if (index === last) index = (index + 1) % options.length;
  return { text: options[index], index };
}

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [typed, setTyped] = useState("");
  const [thinking, setThinking] = useState(false);
  const lastIndexes = useRef<Record<string, number>>({});

  const key = submitted.trim().toLowerCase();
  const response = useMemo(() => {
    const list = BOT_RESPONSES[key] ?? FALLBACK;
    const prev = lastIndexes.current[key] ?? -1;
    const picked = pickResponse(list, prev);
    lastIndexes.current[key] = picked.index;
    return picked.text;
  }, [key]);

  useEffect(() => {
    if (!open || !submitted) return;

    let intervalId: number;
    const thinkingTimer = window.setTimeout(() => {
      setThinking(false);
      setTyped("");
      let i = 0;
      intervalId = window.setInterval(() => {
        i += 1;
        setTyped(response.slice(0, i));
        if (i >= response.length) window.clearInterval(intervalId);
      }, 16);
    }, 550 + Math.floor(Math.random() * 550));

    return () => {
      window.clearTimeout(thinkingTimer);
      window.clearInterval(intervalId);
    };
  }, [response, submitted, open]);

  const submitQuery = () => {
    if (!query.trim()) return;
    setThinking(true);
    setTyped("");
    setSubmitted(query);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {open && (
        <div className="mb-3 w-[310px] rounded-2xl border border-empire-gold/25 bg-[#0f1218]/92 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <p className="text-sm font-semibold text-empire-pearl">Empire Force AI • War Advisor</p>
          <p className="mt-1 text-xs text-white/60">Strategic. Confident. Unforgiving.</p>
          <div className="mt-3 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitQuery()}
              placeholder="Type a command question"
              className="w-full rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm outline-none placeholder:text-white/35"
            />
            <button onClick={submitQuery} className="rounded-lg border border-empire-gold/25 bg-empire-gold/90 px-3 text-xs font-semibold text-black">
              Ask
            </button>
          </div>
          <p className="mt-3 min-h-[84px] rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-white/78">
            {thinking ? "Analyzing your command path..." : typed}
            <span className="animate-pulse">▍</span>
          </p>
        </div>
      )}

      <button onClick={() => setOpen((v) => !v)} className="rounded-full border border-empire-gold/30 bg-empire-gold px-5 py-2 text-sm font-semibold text-black shadow-[0_10px_25px_rgba(212,175,55,0.35)]">
        {open ? "Close Advisor" : "Empire AI"}
      </button>
    </div>
  );
}
