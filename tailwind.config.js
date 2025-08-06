/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slateBlack: '#33313B',       // Used as base background color
        deepPlum: '#62374E',         // Used for creative/dsa sections
        tealBlue: '#007880',         // For highlights and buttons
        goldenAmber: '#FDC57B',      // CTA buttons and hover accents
        charcoalBlack: '#1A1A1E',    // True dark background
        softSilver: '#E8ECEF',       // Light contrast text on dark
        emeraldGreen: '#2ECC71',     // Success messages and highlights
        crimsonRed: '#E63946',       // Errors
        softOrange: '#F4A261',       // Warnings and alerts
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
