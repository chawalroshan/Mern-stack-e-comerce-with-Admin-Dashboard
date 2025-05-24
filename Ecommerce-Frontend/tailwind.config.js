// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff5252',
      },
      backgroundColor:{
        primary: '##f5252',
      }
    },
  },
  plugins: [],
}
