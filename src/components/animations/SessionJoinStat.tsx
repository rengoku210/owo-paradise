"use client";

import { useEffect, useRef, useState } from "react";

/**
 * When `value` steps up (new joins detected via polling), animates the displayed number with a short ease.
 */
export function SessionJoinStat({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const displayRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const target = value;
    const from = displayRef.current;
    if (target === from) return;

    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const duration = Math.min(900, 280 + (target - from) * 40);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2);
      const next = Math.round(from + (target - from) * eased);
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <span className="tabular-nums">{display.toLocaleString()}</span>;
}
