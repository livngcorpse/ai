//frontend/tailwind_config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'typing': 'typing 1.4s infinite',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        typing: {
          '0%, 60%, 100%': {
            transform: 'translateY(0)',
            opacity: '0.4'
          },
          '30%': {
            transform: 'translateY(-10px)',
            opacity: '1'
          }
        }
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(45deg, #0a0a1a, #1a0a1a)',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      {
        hacker: {
          "primary": "#00ff00",
          "secondary": "#00cc00",
          "accent": "#ff00ff",
          "neutral": "#000000",
          "base-100": "#000000",
          "base-200": "#001100",
          "base-300": "#002200",
          "info": "#00ffff",
          "success": "#00ff00",
          "warning": "#ffff00",
          "error": "#ff0000",
        },
        retro: {
          "primary": "#ffcc00",
          "secondary": "#ff9900",
          "accent": "#ff6600",
          "neutral": "#1a1a0a",
          "base-100": "#1a1a0a",
          "base-200": "#2a2a1a",
          "base-300": "#3a3a2a",
          "info": "#00ccff",
          "success": "#00ff00",
          "warning": "#ffff00",
          "error": "#ff3300",
        },
        cyberpunk: {
          "primary": "#ff00ff",
          "secondary": "#00ffff",
          "accent": "#ffff00",
          "neutral": "#0a0a1a",
          "base-100": "#0a0a1a",
          "base-200": "#1a0a1a",
          "base-300": "#2a1a2a",
          "info": "#00ccff",
          "success": "#00ff88",
          "warning": "#ffaa00",
          "error": "#ff0088",
        },
        zen: {
          "primary": "#8b9dc3",
          "secondary": "#7c9885",
          "accent": "#86a59c",
          "neutral": "#2d3748",
          "base-100": "#fafafa",
          "base-200": "#f0f0f0",
          "base-300": "#e6e6e6",
          "info": "#3182ce",
          "success": "#38a169",
          "warning": "#d69e2e",
          "error": "#e53e3e",
        }
      }
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: "",
    logs: true,
  },
}