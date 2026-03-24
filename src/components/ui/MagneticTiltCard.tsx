"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useUISound } from "@/hooks/useUISound";

type Props = {
  children: ReactNode;
  className?: string;
  tiltStrength?: number;
  magneticStrength?: number;
  uiSound?: boolean;
};

const liftEase = { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };

/**
 * Subtle lift + tilt/magnetic; shadow deepens with tilt and extra spread while hovered.
 */
export function MagneticTiltCard({
  children,
  className = "",
  tiltStrength = 10,
  magneticStrength = 0.12,
  uiSound = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { playHover } = useUISound();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const magX = useMotionValue(0);
  const magY = useMotionValue(0);
  const hoverRaw = useMotionValue(0);
  const hoverSpring = useSpring(hoverRaw, { stiffness: 420, damping: 36 });

  const rotateX = useSpring(
    useTransform(my, [-0.5, 0.5], [tiltStrength, -tiltStrength]),
    { stiffness: 280, damping: 24 }
  );
  const rotateY = useSpring(
    useTransform(mx, [-0.5, 0.5], [-tiltStrength, tiltStrength]),
    { stiffness: 280, damping: 24 }
  );
  const smagX = useSpring(magX, { stiffness: 320, damping: 26 });
  const smagY = useSpring(magY, { stiffness: 320, damping: 26 });

  const boxShadow = useTransform([mx, my, hoverSpring], ([px, py, h]) => {
    const p = Math.min(1, Math.abs(px as number) + Math.abs(py as number));
    const hv = h as number;
    const lift = 16 + p * 28 + hv * 10;
    const blur = 40 + p * 52 + hv * 18;
    const alpha = 0.36 + p * 0.22 + hv * 0.1;
    const glow = 0.13 + p * 0.24 + hv * 0.12;
    return `0 ${lift}px ${blur}px rgba(0,0,0,${alpha}), 0 0 ${28 + p * 56 + hv * 20}px rgba(255,75,212,${glow})`;
  });

  const resetTilt = () => {
    mx.set(0);
    my.set(0);
    magX.set(0);
    magY.set(0);
  };

  const onMove = (e: MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    mx.set(px);
    my.set(py);
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    magX.set((e.clientX - cx) * magneticStrength);
    magY.set((e.clientY - cy) * magneticStrength);
  };

  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={liftEase}
      onPointerEnter={() => {
        if (uiSound) playHover();
        hoverRaw.set(1);
      }}
      onPointerLeave={() => {
        hoverRaw.set(0);
        resetTilt();
      }}
    >
      <motion.div
        ref={ref}
        data-cursor-glow="strong"
        onMouseMove={onMove}
        style={{
          x: smagX,
          y: smagY,
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          transformPerspective: 900,
          boxShadow: reduce ? undefined : boxShadow,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
