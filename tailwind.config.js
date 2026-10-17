
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        otpit: {
          background: "#F8F7F2",
          primary: "#344C3D",
          accent: "#DCE6D8",
          text: "#26352C",
          muted: "#858B83",
        },
      },
    },
  },
  plugins: [],
};
