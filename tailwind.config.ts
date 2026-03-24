import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#0a0612",
        ink: "#12081f",
        neon: {
          pink: "#ff4bd4",
          purple: "#b366ff",
          cyan: "#5cf3ff",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255,75,212,0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(92,243,255,0.08), transparent)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 75, 212, 0.35), 0 0 80px rgba(179, 102, 255, 0.2)",
        "glow-cyan": "0 0 30px rgba(92, 243, 255, 0.4)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.85", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.15)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
