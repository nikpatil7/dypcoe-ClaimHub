/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef9ff',
          100: '#dcf3ff',
          200: '#b6e9ff',
          300: '#79dbff',
          400: '#36c6ff',
          500: '#0aafff',
          600: '#0091ff',
          700: '#0071cc',
          800: '#0060a9',
          900: '#0b518a',
          950: '#0a315a',
        },
        secondary: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d8d9dd',
          300: '#b6b8bf',
          400: '#8f919c',
          500: '#6b6d7a',
          600: '#565864',
          700: '#474852',
          800: '#3d3e45',
          900: '#35363c',
          950: '#24242a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
