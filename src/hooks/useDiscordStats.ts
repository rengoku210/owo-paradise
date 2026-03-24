"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DiscordStats = {
  total: number;
  online: number;
  source: string;
  hint?: string;
};

const DEFAULT_POLL_MS = 45_000;

/**
 * Fetches `/api/discord` on mount and on an interval. When `total` increases between polls,
 * the delta is accumulated into `sessionJoins` for a “live join” style counter while browsing.
 */
export function useDiscordStats(pollIntervalMs = DEFAULT_POLL_MS) {
  const [data, setData] = useState<DiscordStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionJoins, setSessionJoins] = useState(0);
  const lastTotalRef = useRef<number | null>(null);

  const applyPayload = useCallback((json: DiscordStats) => {
    setData(json);
    setError(null);
    const prev = lastTotalRef.current;
    if (prev !== null && json.total > prev) {
      setSessionJoins((s) => s + (json.total - prev));
    }
    lastTotalRef.current = json.total;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const res = await fetch("/api/discord", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load stats");
        const json = (await res.json()) as DiscordStats;
        if (!cancelled) applyPayload(json);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Error");
        }
      }
    };

    void run();
    const id = window.setInterval(() => void run(), pollIntervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [pollIntervalMs, applyPayload]);

  return { data, error, sessionJoins };
}
