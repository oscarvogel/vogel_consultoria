/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html", "./*/index.html", "./recursos/*/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Bricolage Grotesque", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        panel: "var(--color-panel)",
        foreground: "var(--color-text)",
        muted: "var(--color-muted)",
        link: "var(--color-link)",
        action: "var(--color-action)",
        focus: "var(--color-focus)",
        error: "var(--color-error)",
        success: "var(--color-success)",
        vogel: {
          deep: "rgb(var(--vogel-deep) / <alpha-value>)",
          blue: "rgb(var(--vogel-blue) / <alpha-value>)",
          blueLight: "rgb(var(--vogel-blueLight) / <alpha-value>)",
          bright: "rgb(var(--vogel-bright) / <alpha-value>)",
          gray: "rgb(var(--vogel-gray) / <alpha-value>)",
          amber: "rgb(var(--vogel-amber) / <alpha-value>)",
          slate: "rgb(var(--vogel-slate) / <alpha-value>)",
          navy: "rgb(var(--vogel-navy) / <alpha-value>)",
          muted: "rgb(var(--vogel-muted) / <alpha-value>)",
        },
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        glow: "var(--shadow-panel)",
        "glow-amber": "var(--shadow-panel)",
        "glow-lg": "var(--shadow-panel)",
      },
      backgroundImage: {
        "grid-soft":
          "linear-gradient(rgba(229, 231, 235, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(229, 231, 235, 0.05) 1px, transparent 1px)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.4, 0, 0.2, 1) both",
        "fade-in": "fadeIn 0.6s ease both",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
