// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1da1f2',
      },
      backgroundColor: {
        primary: '#1da1f2', 
      }
    },
  },
  plugins: [],
}
