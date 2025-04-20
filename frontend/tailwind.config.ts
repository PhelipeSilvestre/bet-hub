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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0070f3",
          50: "#e0f2fe",
          100: "#b9e6fe",
          200: "#7cd4fd",
          300: "#36bffa",
          400: "#0ca6f4",
          500: "#0070f3",
          600: "#0055d4",
          700: "#0040ac",
          800: "#002f84",
          900: "#001f5c",
        },
        secondary: {
          DEFAULT: "#6c18b5",
          50: "#f3e8ff",
          100: "#e6ccff",
          200: "#d1a7ff",
          300: "#b975fd",
          400: "#9e42f5",
          500: "#8623e0",
          600: "#6c18b5",
          700: "#521293",
          800: "#3d0e72",
          900: "#290953",
        },
        success: {
          DEFAULT: "#10b981",
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
      },
    },
  },
};

export default config;