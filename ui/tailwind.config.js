/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
    },
    colors,
    screens: {
      sm: `600px`,
      md: `900px`,
      lg: `1200px`,
      xl: `1536px`,
    }
  },
  plugins: [],
  important: true,
}
