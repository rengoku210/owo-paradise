import { NextResponse } from "next/server";

export const revalidate = 60;

type DiscordGuild = {
  approximate_member_count?: number;
  approximate_presence_count?: number;
  member_count?: number;
};

type WidgetJson = {
  presence_count?: number;
};

/**
 * Fetches live-ish Discord stats server-side so tokens stay secret.
 * Priority: Bot REST (accurate) → public widget JSON → demo fallback.
 */
export async function GET() {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID || process.env.NEXT_PUBLIC_DISCORD_GUILD_ID;

  if (botToken && guildId) {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
      {
        headers: { Authorization: `Bot ${botToken}` },
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      const data = (await res.json()) as DiscordGuild;
      const total =
        data.approximate_member_count ?? data.member_count ?? null;
      const online = data.approximate_presence_count ?? null;
      if (total != null) {
        return NextResponse.json({
          total,
          online: online ?? Math.round(total * 0.12),
          source: "bot",
        });
      }
    }
  }

  if (guildId) {
    const w = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`, {
      next: { revalidate: 120 },
    });
    if (w.ok) {
      const data = (await w.json()) as WidgetJson;
      const online = data.presence_count ?? 0;
      // Widget JSON does not include total member count; show a soft estimate for UI continuity.
      const estimatedTotal = online > 0 ? Math.round(online * 8.2) : 720;
      return NextResponse.json({
        total: Math.max(estimatedTotal, online),
        online,
        source: "widget",
        hint: "Total is estimated from widget presence; add DISCORD_BOT_TOKEN for exact counts.",
      });
    }
  }

  return NextResponse.json({
    total: 2048,
    online: 186,
    source: "demo",
    hint: "Set DISCORD_BOT_TOKEN + DISCORD_GUILD_ID in .env for live data.",
  });
}
