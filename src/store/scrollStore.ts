import { create } from "zustand";

/**
 * Lenis scroll position (px) for parallax + WebGL camera — updated from SmoothScroll.
 */
export const useScrollStore = create<{
  scrollY: number;
  setScrollY: (y: number) => void;
}>((set) => ({
  scrollY: 0,
  setScrollY: (y) => set({ scrollY: y }),
}));
