"use client";

import { useRef, type ReactNode } from "react";
import { motion, useSpring, useMotionValue, type HTMLMotionProps } from "framer-motion";
import { useUISound } from "@/hooks/useUISound";

const hoverSpring = { type: "spring" as const, stiffness: 300, damping: 18 };

type Props = HTMLMotionProps<"a"> & {
  children: ReactNode;
  strength?: number;
  soundOnHover?: boolean;
};

/**
 * Magnetic pull + springy press/hover + optional UI sound.
 */
export function MagneticButton({
  children,
  className = "",
  strength = 0.22,
  soundOnHover = true,
  transition: entranceTransition,
  ...rest
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 22, mass: 0.4 });
  const { playHover } = useUISound();

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const transition =
    entranceTransition && typeof entranceTransition === "object"
      ? {
          opacity: entranceTransition,
          y: entranceTransition,
          scale: hoverSpring,
        }
      : hoverSpring;

  return (
    <motion.a
      ref={ref}
      data-cursor-glow="strong"
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onPointerEnter={() => soundOnHover && playHover()}
      whileHover={{ scale: 1.03, transition: hoverSpring }}
      whileTap={{ scale: 0.95, transition: hoverSpring }}
      transition={transition}
      className={className}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
