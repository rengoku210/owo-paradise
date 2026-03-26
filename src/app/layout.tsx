import type { Metadata } from "next";
import { Outfit, Sora } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { ParallaxBackdrop } from "@/components/effects/ParallaxBackdrop";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { ScrollAnimations } from "@/components/effects/ScrollAnimations";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { ViewportSync } from "@/components/effects/ViewportSync";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Empire Force · Command Server",
  description:
    "Empire Force is a dark elite economy command server experience: build, dominate, and earn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans use-custom-cursor overflow-x-hidden">
        <ParallaxBackdrop />
        <CustomCursor />
        <SoundToggle />
        <ScrollAnimations />
        <SmoothScroll />
        <ViewportSync />
        {children}
      </body>
    </html>
  );
}
