/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      'sans': ['Manrope'],
      'serif': ['Manrope'],
      'mono': ['Manrope'],
      'display': ['Manrope'],
      'body': ['Manrope'],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#23538F',
        },
        neon: '#C3F53B',
      },
    },
  },
  plugins: [],
};
