import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        "4.5": "1.125rem",
        "9.5": "2.375rem",
        "11.5": "2.875rem",
      },
      colors: {
        transitionProperty: {
          height: "height",
        },
        budiluhur: {
          50: "#dbf8ff",
          100: "#b4e6fa",
          200: "#89d5f3",
          300: "#5ec2ec",
          400: "#34b1e5",
          500: "#1a97cb",
          600: "#0a769f",
          700: "#005473",
          800: "#003348",
          900: "#00131d",
          DEFAULT: "#1a97cb",
        },
        primary: {
          50: "#dbf8ff",
          100: "#b4e6fa",
          200: "#89d5f3",
          300: "#5ec2ec",
          400: "#34b1e5",
          500: "#1a97cb",
          600: "#0a769f",
          700: "#005473",
          800: "#003348",
          900: "#00131d",
          DEFAULT: "#1a97cb",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      addCommonColors: true,
    }),
  ],
};
export default config;
