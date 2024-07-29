/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
  theme: {
    extend: {
      colors: {
        "board-light": "var(--color-board-light)",
        "board-dark": "var(--color-board-dark)",
        "piece-white": "var(--color-piece-white)",
        "piece-black": "var(--color-piece-black)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        outline: "var(--color-outline)",
        "label-light": "var(--color-label-light)",
        "label-dark": "var(--color-label-dark)",
        "legal-move": "var(--color-legal-move)",
        "capture-border-light": "var(--color-capture-border-light)",
        "capture-border-dark": "var(--color-capture-border-dark)",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["hover"],
    },
  },
};

export default config;
