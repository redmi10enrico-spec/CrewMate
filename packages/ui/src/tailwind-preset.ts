import type { Config } from "tailwindcss";

export const tailwindPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        bg: {
          950: "#03050a",
          900: "#060910",
          800: "#0a0e18",
          700: "#10141f",
        },
        surface: {
          DEFAULT: "#0d1220",
          hover: "#121829",
          alt: "#141a2b",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(255, 255, 255, 0.16)",
          strong: "rgba(63, 201, 255, 0.4)",
        },
        accent: {
          DEFAULT: "#3fc9ff",
          hover: "#63d4ff",
          active: "#1a8fd4",
          muted: "rgba(63, 201, 255, 0.12)",
        },
        success: {
          DEFAULT: "#4ade80",
          muted: "rgba(74, 222, 128, 0.12)",
        },
        warning: {
          DEFAULT: "#fbbf24",
          muted: "rgba(251, 191, 36, 0.12)",
        },
        danger: {
          DEFAULT: "#f87171",
          muted: "rgba(248, 113, 113, 0.12)",
        },
        text: {
          DEFAULT: "#f4f6fb",
          muted: "#9aa4b8",
          dim: "#5b6478",
        },
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        lg: "20px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
        DEFAULT: "0 8px 24px rgba(0, 0, 0, 0.35)",
        lg: "0 24px 64px rgba(0, 0, 0, 0.5)",
        glow: "0 0 0 1px rgba(63, 201, 255, 0.15), 0 8px 24px rgba(63, 201, 255, 0.12)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        site: "1180px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "scale-in": "scale-in 0.2s ease-out both",
      },
    },
  },
};

export default tailwindPreset;
