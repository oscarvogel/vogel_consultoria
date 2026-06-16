/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./ia.html", "./inteligencia-artificial/index.html", "./encuesta-contadores/index.html", "./automatizaciones/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        vogel: {
          deep: "#0F2A44",
          blue: "#1E5FA8",
          blueLight: "#8BC5FF",
          bright: "#196ECF",
          gray: "#E5E7EB",
          amber: "#F2A900",
          slate: "#162f49",
          navy: "#0B2035",
          muted: "#8ea8c3",
        },
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        glow: "0 20px 45px -20px rgba(30, 95, 168, 0.65)",
        "glow-amber": "0 20px 45px -20px rgba(242, 169, 0, 0.45)",
        "glow-lg": "0 32px 80px -24px rgba(30, 95, 168, 0.8)",
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
