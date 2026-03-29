/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        sand: "rgb(var(--color-sand) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        accentSoft: "rgb(var(--color-accent-soft) / <alpha-value>)",
        quadRed: "rgb(var(--color-quad-red) / <alpha-value>)",
        quadGold: "rgb(var(--color-quad-gold) / <alpha-value>)",
        quadBlue: "rgb(var(--color-quad-blue) / <alpha-value>)",
        quadPurple: "rgb(var(--color-quad-purple) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["Source Sans 3", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        display: ["Bodoni Moda", "Georgia", "serif"]
      },
      boxShadow: {
        card: "0 24px 80px rgba(76, 60, 42, 0.08)"
      },
      backgroundImage: {
        halo: "radial-gradient(circle at top, rgb(var(--color-accent-soft) / 0.45), transparent 38%)"
      }
    }
  },
  plugins: []
};
