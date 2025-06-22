/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0a0a',
          text: '#00ff00',
          accent: '#ff6b6b',
          secondary: '#4ecdc4'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}