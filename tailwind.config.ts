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
          DEFAULT: "#F3F2ED",
          50: "#FDFCF9",
          100: "#F9F5EE",
          200: "#F3F2ED",
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
          DEFAULT: "#1C2626",
          light: "#3D3A35",
          muted: "#6B6560",
        },
      },
      fontFamily: {
        sans: ["var(--font-general-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-general-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.2em",
      },
      screens: {
        "3xl": "1441px",
      },
      // Hiérarchie d'empilement centralisée (cf. components/layout/Header.tsx, CookieBanner.tsx)
      zIndex: {
        banner: "50",   // Bandeau cookies — base de l'overlay
        tooltip: "50",  // Tooltips "À venir" (ComingSoonLink, FeaturedWork)
        navbar: "70",   // Headers absolu + fixe
        modal: "80",    // Menu plein-écran
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
