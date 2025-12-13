/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        zentry: ["zentry", "sans-serif"],
        general: ["general", "sans-serif"],
        "circular-web": ["circular-web", "sans-serif"],
        "robert-medium": ["robert-medium", "sans-serif"],
        "robert-regular": ["robert-regular", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: '#10b981',
          foreground: '#0f172a'
        },
        secondary: '#06b6d4',
        accent: '#7c3aed',
        destructive: '#ef4444',
        'demand-hot': '#ff5f00',
        'demand-warm': '#ffd426',
        'demand-cold': '#60a5fa',
        'position-gk': '#facc15',
        'position-def': '#60a5fa',
        'position-mid': '#34d399',
        'position-fwd': '#fb923c',
        blue: {
          50: "#DFDFF0",
          75: "#dfdff2",
          100: "#F0F2FA",
          200: "#010101",
          300: "#4FB7DD",
        },
        violet: {
          300: "#5724ff",
        },
        yellow: {
          100: "#8e983f",
          300: "#edff66",
        },
      },
    },
  },
  plugins: [],
};
