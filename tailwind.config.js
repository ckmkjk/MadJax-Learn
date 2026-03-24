/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sonic: {
          blue: '#0051A8',
          yellow: '#FFD700',
          red: '#E60012',
          green: '#00A651',
          dark: '#1a1a2e',
          light: '#e0f7fa',
        }
      },
      fontFamily: {
        game: ['"Press Start 2P"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
