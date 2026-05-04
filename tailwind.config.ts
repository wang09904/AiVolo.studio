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
          bg: '#FAFAF9', // stone-50
          surface: '#FFFFFF', // white
          border: '#E7E5E4', // stone-200
          cta: '#7C3AED', // violet-600
          secondary: '#EDE9FE', // violet-100
          text: '#1C1917', // stone-900
          muted: '#78716C', // stone-500
        },
      },
      fontFamily: {
        sans: ['var(--font-bricolage)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
