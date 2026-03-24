"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/cn";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  /** ScrollTrigger start offset (seconds-ish mapping) — staggers section entrances. */
  delay?: number;
  /** Stacking order for overlapping sections */
  layerZ?: number;
  /** Pull section up over the previous (except when false) */
  overlap?: boolean;
  /** Dim backdrop while section is in view */
  activeDim?: boolean;
};

/**
 * Scroll-linked reveal + layout shell: overlap, z-index, soft fades, ambient shadow, in-view dim.
 */
export function SectionReveal({
  children,
  className,
  delay = 0,
  layerZ = 10,
  overlap = true,
  activeDim = true,
}: SectionRevealProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(outerRef, { amount: 0.32, margin: "-8% 0px -8% 0px" });

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = innerRef.current;
    if (!el) return;

    if (reduce) {
      gsap.set(el, {
        y: 0,
        opacity: 1,
        z: 0,
        scale: 1,
        filter: "none",
        clearProps: "transform",
      });
      return;
    }

    const startPct = Math.max(72, 90 - delay * 55);

    const tween = gsap.fromTo(
      el,
      {
        y: 40,
        opacity: 0,
        z: -200,
        scale: 0.95,
        filter: "blur(6px)",
        transformOrigin: "50% 55%",
        force3D: true,
      },
      {
        y: 0,
        opacity: 1,
        z: 0,
        scale: 1,
        filter: "blur(0px)",
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: `top ${startPct}%`,
          end: "top 36%",
          scrub: 0.85,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, reduce]);

  return (
    <div
      ref={outerRef}
      className={cn("relative", overlap && "-mt-14 md:-mt-[4.5rem]", className)}
      style={{ zIndex: layerZ }}
    >
      {activeDim && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[1] rounded-[inherit] bg-black/0 transition-opacity duration-[700ms] ease-out"
          style={{ opacity: inView ? 0.22 : 0 }}
        />
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 left-0 right-0 z-[2] h-24 bg-gradient-to-b from-night via-night/70 to-transparent md:-top-14 md:h-28"
      />

      <div
        ref={innerRef}
        className="relative rounded-[inherit] shadow-[0_40px_120px_rgba(0,0,0,0.22)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
}
