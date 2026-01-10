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
        'silicon-alley': {
          primary: '#FF6B35',
          secondary: '#004E89',
          accent: '#F7B801',
          dark: '#1A1A1A',
          light: '#F4F4F4',
        },
      },
      fontFamily: {
        mono: ['Monaco', 'Courier New', 'monospace'],
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
