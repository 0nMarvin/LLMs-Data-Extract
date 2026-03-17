/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: colors.amber, 
      },
      // ADICIONE ESTA PARTE ABAIXO:
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}