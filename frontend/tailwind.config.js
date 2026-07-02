/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0D0B14",
        surface: "#171420",
        "surface-2": "#211C2E",
        "surface-3": "#2C2540",
        ember: "#FF6B4A",
        gold: "#FFC24A",
        violet: "#8B7CFF",
        ink: "#F5F1EA",
        muted: "#9A93A8",
        line: "#2A2438",
      },
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body: ["'Satoshi'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "ember-gold": "linear-gradient(135deg, #FF6B4A 0%, #FFC24A 100%)",
        "aurora": "radial-gradient(60% 60% at 30% 20%, rgba(255,107,74,0.18) 0%, transparent 60%), radial-gradient(50% 50% at 80% 0%, rgba(139,124,255,0.15) 0%, transparent 60%)",
      },
      animation: {
        "caret-blink": "caret-blink 1s step-end infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
      },
      keyframes: {
        "caret-blink": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
