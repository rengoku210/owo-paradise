"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/store/scrollStore";
import { triggerScrollBurst } from "@/lib/scrollBurst";

/**
 * Lenis + GSAP ScrollTrigger: buttery scroll without fighting the animation timeline.
 * Keeps ScrollTrigger in sync via the shared GSAP ticker.
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", (l) => {
      useScrollStore.getState().setScrollY(l.scroll);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduceMotion && Math.abs(l.velocity) > 0.72 && l.scroll > 14) {
        triggerScrollBurst();
      }
      ScrollTrigger.update();
    });

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, []);

  return null;
}
