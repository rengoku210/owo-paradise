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
        night: "#080a0f",
        ink: "#0d1117",
        neon: {
          pink: "#ff4bd4",
          purple: "#b366ff",
          cyan: "#5cf3ff",
        },
        empire: {
          gold: "#d4af37",
          bronze: "#9c7a2d",
          pearl: "#f5e6ba",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.2), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(245,230,186,0.1), transparent)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(212, 175, 55, 0.35), 0 0 80px rgba(156, 122, 45, 0.2)",
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
