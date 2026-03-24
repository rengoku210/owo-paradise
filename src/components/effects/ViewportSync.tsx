"use client";

import { useEffect } from "react";
import { useUiStore } from "@/store/uiStore";

/** Syncs coarse breakpoint into Zustand so Three.js can reduce particle / mesh cost on phones. */
export function ViewportSync() {
  const setMobileCanvas = useUiStore((s) => s.setMobileCanvas);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setMobileCanvas(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [setMobileCanvas]);

  return null;
}
