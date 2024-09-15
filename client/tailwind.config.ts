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
        'white': 'var(--color-white)',
        'board-light': 'var(--color-board-light)',
        'board-dark': 'var(--color-board-dark)',
        'piece-white': 'var(--color-piece-white)',
        'piece-black': 'var(--color-piece-black)',
        'accent': 'var(--color-accent)',
        'background': 'var(--color-background)',
        'outline': 'var(--color-outline)',
        'label-light': 'var(--color-label-light)',
        'label-dark': 'var(--color-label-dark)',
        'legal-move': 'var(--color-legal-move)',
        'capture-border-light': 'var(--color-capture-border-light)',
        'capture-border-dark': 'var(--color-capture-border-dark)',
      },
    },
  },
  plugins: [],
};
export default config;
