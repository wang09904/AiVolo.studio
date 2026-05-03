import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#09090b', // zinc-950
          surface: '#18181b', // zinc-900
          border: 'rgba(39, 39, 42, 0.5)', // zinc-800/50
          cta: '#2563eb', // blue-600
          text: '#f4f4f5', // zinc-100
          muted: '#a1a1aa', // zinc-400
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
