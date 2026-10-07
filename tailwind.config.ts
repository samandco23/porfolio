import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          50: "#050505",
          400: "#0a0a0a",
          800: "#101010",
          950: "#050505",
        },
        accent: {
          DEFAULT: "#00FF66",
          dim: "#00cc52",
          muted: "rgba(0, 255, 102, 0.10)",
        },
      },
      borderColor: {
        DEFAULT: "#27272a", // zinc-800
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        micro: ["0.65rem", { lineHeight: "1.4", letterSpacing: "0.18em" }],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        blink: "blink 1.1s step-end infinite",
        scan: "scan 9s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
