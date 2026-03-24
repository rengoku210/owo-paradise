"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Registers GSAP ScrollTrigger once and refreshes on route/layout changes.
 * Section-level tweens live next to their components; this only bootstraps the plugin.
 */
export function ScrollAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
