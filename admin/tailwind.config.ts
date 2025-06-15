import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],

  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        "background-color": "var(--background-color)",
        "contraction-background-color": "var(--contraction-background-color)",

        "primary-theme": "var(--primary-theme)",
        "secondary-theme": "var(--secondary-theme)",

        "general-hover": "var(--general-hover)",
        "primary-theme-hover": "var(--primary-theme-hover)",
        "secondary-theme-hover": "var(--secondary-theme-hover)",
        "selected-color": "var(--selected-color)",

        "heading-color": "var(--heading-color)",
        "paragraph-color": "var(--paragraph-color)",
        "theme-heading-color": "var(--theme-heading-color)",
        "theme-paragraph-color": "var(--theme-paragraph-color)",

        border: "var(--border)",

        card: {
          DEFAULT: "var(--card)",
        },

        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",

          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",

          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        jetbrains_mono: ["var(--font-jetbrains-mono)", "monospace"],
      },

      screens: {
        xs: "320px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1440px",
        "2xl": "1536px",
      },
    },
  },

  plugins: [
    function ({ addComponents }: PluginAPI) {
      addComponents({
        ".layout-standard": {
          width: "92%",
          marginLeft: "auto",
          marginRight: "auto",

          "@screen lg": {
            width: "97%",
          },
        },

        ".page-layout-standard": {
          width: "92%",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",

          "@screen lg": {
            width: "97%",
          },
        },

        ".flex-center": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },

        ".animation-standard": {
          transition: "all ease-in-out 0.5s",
        },

        ".section-padding-standard": {
          paddingTop: "2rem",
          paddingBottom: "2rem",
        },

        ".section-margin-standard": {
          marginTop: "2rem",
          marginBottom: "2rem",
        },

        ".card-box-shadow": {
          boxShadow: "0 0.375rem 1rem rgba(0, 0, 0, 0.1)",
        },
      });
    },

    tailwindcssAnimate,
  ],
} satisfies Config;
