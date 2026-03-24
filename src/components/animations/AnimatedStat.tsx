"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** Counts up when scrolled into view (one-shot) for live Discord numbers. */
export function AnimatedStat({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1100;
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}
