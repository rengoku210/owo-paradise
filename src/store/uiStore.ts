import { create } from "zustand";

type UiState = {
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  isMobileCanvas: boolean;
  setMobileCanvas: (v: boolean) => void;
};

/**
 * Lightweight UI flags. Sound is optional ambient UI feedback;
 * 3D density can be reduced on small viewports for FPS.
 */
export const useUiStore = create<UiState>((set) => ({
  soundEnabled: false,
  setSoundEnabled: (v) => set({ soundEnabled: v }),
  isMobileCanvas: false,
  setMobileCanvas: (v) => set({ isMobileCanvas: v }),
}));
