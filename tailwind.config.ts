import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: { 50: "rgb(var(--surface) / <alpha-value>)", 400: "rgb(var(--surface-raised) / <alpha-value>)", 800: "rgb(var(--surface-raised) / <alpha-value>)", 950: "rgb(var(--surface) / <alpha-value>)" },
        accent: { DEFAULT: "rgb(var(--accent) / <alpha-value>)", dim: "rgb(var(--accent) / <alpha-value>)", muted: "rgb(var(--accent) / 0.10)" },
        white: "rgb(var(--foreground) / <alpha-value>)",
        black: "rgb(var(--panel) / <alpha-value>)",
        red: { 400: "rgb(var(--danger) / <alpha-value>)" },
        zinc: Object.fromEntries([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => [shade, `rgb(var(--zinc-${shade}) / <alpha-value>)`])),
      },
      borderColor: {
        DEFAULT: "rgb(var(--zinc-800) / 1)", // zinc-800
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
