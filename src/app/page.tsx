import { HeroSection } from "@/components/sections/HeroSection";
import { DiscordStatsSection } from "@/components/sections/DiscordStatsSection";
import { ServerPreviewSection } from "@/components/sections/ServerPreviewSection";
import { StaffSection } from "@/components/sections/StaffSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

const invite =
  process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "https://discord.com/channels/@me";

export default function Home() {
  return (
    <main className="relative z-[2]">
      <HeroSection />

      <div className="relative z-[1] pb-12" style={{ perspective: "1200px" }}>
        <DiscordStatsSection />
        <ServerPreviewSection />
        <StaffSection />
        <FeaturesSection />
        <FinalCTASection />
      </div>

      <footer className="relative z-[35] border-t border-white/10 bg-night/90 px-6 py-10 text-center text-sm text-white/50 backdrop-blur-md">
        <p className="font-display text-base font-semibold text-white/80">OwO Paradise</p>
        <p className="mt-2 max-w-md mx-auto">
          Fan-made showcase layout — not affiliated with Discord.
        </p>
        <a
          href={invite}
          className="mt-3 inline-block text-neon-cyan/90 hover:text-white transition"
        >
          Join the server
        </a>
      </footer>
    </main>
  );
}
