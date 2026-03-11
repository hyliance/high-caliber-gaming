const path = require("path");
// Convert Windows backslashes to forward slashes for Tailwind glob compatibility
const dir = __dirname.replace(/\\/g, "/");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    `${dir}/pages/**/*.{js,ts,jsx,tsx}`,
    `${dir}/components/**/*.{js,ts,jsx,tsx}`,
    `${dir}/app/**/*.{js,ts,jsx,tsx}`,
    `${dir}/src/**/*.{js,ts,jsx,tsx}`,
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        hcg: {
          // ── Blue/Cyan primary palette (brand identity) ──────────────
          blue: "#00B4FF",
          "blue-dark": "#007ACC",
          "blue-light": "#38C8FF",
          "blue-mid": "#3B7BF0",
          steel: "#2356A3",
          violet: "#8B85FF",
          // ── Gold (premium / tier indicators) ────────────────────────
          gold: "#FFB800",
          "gold-dark": "#CC9200",
          "gold-light": "#FFD466",
          // ── Alert / danger ───────────────────────────────────────────
          red: "#CC2222",
          "red-dark": "#991A1A",
          // ── Backgrounds ──────────────────────────────────────────────
          bg: "#08080E",
          card: "#0D0D1A",
          "card-hover": "#131328",
          border: "#1E2035",
          // ── Text ─────────────────────────────────────────────────────
          muted: "#6B7280",
          "muted-dark": "#4B5563",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        // KVC-Brute — grunge brush script for hero / large display headlines
        brute: ['"KVC-Brute"', "Impact", "system-ui", "sans-serif"],
        // Azonix — clean tech/military font for UI labels, brand name
        azonix: ["Azonix", "Rajdhani", "system-ui", "sans-serif"],
        // Rajdhani — secondary display (subheadings, card titles)
        display: ["Rajdhani", "Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-blue": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 180, 255, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(0, 180, 255, 0)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 184, 0, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(255, 184, 0, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "float-up": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-blue": "pulse-blue 2s infinite",
        "pulse-gold": "pulse-gold 2s infinite",
        shimmer: "shimmer 2s linear infinite",
        "float-up": "float-up 4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
