/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#adc0fb',
          400: '#8ca7f9',
          500: '#6b8ef7',
          600: '#5571c5',
          700: '#405594',
          800: '#2b3962',
          900: '#151c31',
        },
      },
    },
  },
  plugins: [],
}
