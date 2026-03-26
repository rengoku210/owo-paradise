import { HeroSection } from "@/components/sections/HeroSection";
import { DiscordStatsSection } from "@/components/sections/DiscordStatsSection";
import { PlayerProfileSection } from "@/components/sections/PlayerProfileSection";
import { ServerPreviewSection } from "@/components/sections/ServerPreviewSection";
import { StaffSection } from "@/components/sections/StaffSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { AIChatbot } from "@/components/sections/AIChatbot";

const invite = "https://discord.gg/959cmX7YJn";

export default function Home() {
  return (
    <main className="relative z-[2]">
      <HeroSection />

      <div className="relative z-[1] pb-12" style={{ perspective: "1200px" }}>
        <DiscordStatsSection />
        <PlayerProfileSection />
        <ServerPreviewSection />
        <StaffSection />
        <FeaturesSection />
        <FinalCTASection />
      </div>

      <footer className="relative z-[35] border-t border-white/10 bg-night/90 px-6 py-10 text-center text-sm text-white/50 backdrop-blur-md">
        <p className="font-display text-base font-semibold text-empire-pearl">Empire Force</p>
        <p className="mx-auto mt-2 max-w-md">Elite economy command server concept interface.</p>
        <a href={invite} className="mt-3 inline-block text-empire-gold hover:text-white transition">
          Join Empire Force
        </a>
      </footer>

      <AIChatbot />
    </main>
  );
}
