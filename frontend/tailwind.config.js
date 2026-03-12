/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1B3A5C",
        secondary: "#1B4332",
        accent: "#00B4D8",
        background: "#F0F4F8",
        surface: "#FFFFFF",
        textPrimary: "#1A1A2E",
        textSecondary: "#4A5568",
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.1)',
        md: '0 4px 6px rgba(0,0,0,0.1)',
        lg: '0 10px 25px rgba(0,0,0,0.15)',
      },
      borderRadius: {
        DEFAULT: '8px',
      }
    },
  },
  plugins: [],
}
