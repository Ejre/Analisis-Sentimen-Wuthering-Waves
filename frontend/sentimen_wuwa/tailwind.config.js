// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom dark theme palette
        'abyss': '#0f172a', // Slate 900
        'neon-cyan': '#22d3ee', // Cyan 400
        'neon-gold': '#fbbf24', // Amber 400
        'glass-surface': 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity
      },
      fontFamily: {
        'tech': ['"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
