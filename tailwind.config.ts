import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#07050b",
        panel: "#120b1a",
        magenta: {
          50: "#ffe4f7",
          100: "#ffc8ef",
          200: "#ff9be0",
          300: "#ff63ce",
          400: "#ff2db7",
          500: "#e20074",
          600: "#b1005a",
          700: "#7f0041",
          800: "#54002c",
          900: "#32001a"
        }
      },
      fontFamily: {
        display: ["\"Space Grotesk\"", "sans-serif"],
        body: ["\"IBM Plex Sans\"", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(226, 0, 116, 0.25), 0 20px 80px rgba(226, 0, 116, 0.25)",
        panel: "0 30px 120px rgba(4, 2, 8, 0.55)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.65" },
          "70%": { transform: "scale(1.18)", opacity: "0" },
          "100%": { transform: "scale(1.24)", opacity: "0" }
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        }
      },
      animation: {
        "pulse-ring": "pulseRing 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) infinite",
        "float-slow": "floatSlow 7s ease-in-out infinite"
      }
    }
  },
  plugins: []
} satisfies Config;
