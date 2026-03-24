/**
 * Short-lived “scroll kick” for hero camera + foreground parallax (no React state).
 * Triggered from Lenis when the user starts scrolling with meaningful velocity.
 */
export const scrollBurstUntilRef = { value: 0 };

const BURST_MS = 520;

export function triggerScrollBurst() {
  scrollBurstUntilRef.value = performance.now() + BURST_MS;
}

export function isScrollBurstActive() {
  return performance.now() < scrollBurstUntilRef.value;
}
