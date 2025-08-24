/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'iai-blue': '#1A4973',
        'iai-blue-light': '#E6EEF5',
        'iai-bordeaux': '#8B2D2B',
        'iai-bordeaux-light': '#F5EAEA',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
