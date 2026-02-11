/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', '"Inter"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        navy: {
          50: "#f5f5f7",
          100: "#e8e8ed",
          200: "#d2d2d7",
          300: "#a1a1a6",
          400: "#86868b",
          500: "#6e6e73",
          600: "#48484a",
          700: "#3a3a3c",
          800: "#2c2c2e",
          900: "#1d1d1f",
          950: "#000000",
        },
        apple: {
          blue: "#0071e3",
          "blue-hover": "#0077ED",
          gray: "#86868b",
          "dark-bg": "#1c1c1e",
          "dark-card": "#2c2c2e",
          "dark-border": "#38383a",
        }
      },
      borderRadius: {
        'apple': '980px', // Apple's pill radius
      }
    },
  },
  plugins: [],
};
