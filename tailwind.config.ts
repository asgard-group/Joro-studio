import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F4EFE5",
          50: "#FDFCF9",
          100: "#F9F5EE",
          200: "#F4EFE5",
          300: "#EDE4D3",
          400: "#DDD0B8",
          500: "#C9B898",
        },
        terracotta: {
          DEFAULT: "#812403",
          50: "#FDF3EE",
          100: "#F9D9CC",
          200: "#F0A882",
          300: "#D9663A",
          400: "#B84018",
          500: "#812403",
          600: "#651C02",
          700: "#4A1302",
        },
        charcoal: {
          DEFAULT: "#1C1A18",
          light: "#3D3A35",
          muted: "#6B6560",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      letterSpacing: {
        widest: "0.2em",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
