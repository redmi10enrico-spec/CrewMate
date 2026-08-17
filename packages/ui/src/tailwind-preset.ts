import type { Config } from "tailwindcss";

export const tailwindPreset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        bg: {
          900: "#060d1c",
          800: "#0a1428",
          700: "#0d1c38",
          600: "#122645",
        },
        surface: {
          DEFAULT: "#10203d",
          alt: "#16294a",
        },
        accent: {
          DEFAULT: "#3fc9ff",
          strong: "#1a8fd4",
          soft: "rgba(63, 201, 255, 0.15)",
        },
        green: {
          DEFAULT: "#5fd35f",
          strong: "#3fae3f",
        },
        text: {
          DEFAULT: "#e8f4ff",
          muted: "#9fb3cc",
          dim: "#6b7f99",
        },
        danger: "#ff5c5c",
        warning: "#ffcf5c",
        success: "#5fd35f",
        border: {
          DEFAULT: "rgba(63, 201, 255, 0.18)",
          strong: "rgba(63, 201, 255, 0.4)",
        },
      },
      borderRadius: {
        DEFAULT: "10px",
        lg: "16px",
      },
      boxShadow: {
        DEFAULT: "0 8px 30px rgba(0, 0, 0, 0.45)",
        glow: "0 0 24px rgba(63, 201, 255, 0.25)",
      },
      fontFamily: {
        title: ['"Press Start 2P"', "Segoe UI", "system-ui", "sans-serif"],
        body: ["Segoe UI", "system-ui", "-apple-system", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        site: "1180px",
      },
    },
  },
};

export default tailwindPreset;
