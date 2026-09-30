/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graveyard: {
          bg: '#0B0B0F',
          ground: '#15131A',
          stone: '#3A3A40',
          track: '#1F1F24',
          abandoned: '#B03A2E',
          suspicious: '#C0621F',
          inactive: '#B8A02A',
          healthy: '#2F8A55',
          input: '#1A1A1F',
          border: '#2A2A30',
          textMuted: '#8A8A92',
          textPrimary: '#F5F5F7',
        }
      },
      fontFamily: {
        ui: ['Inter', 'Geist', 'SF Pro', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
