/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "#FFFFFF",
          surface: "#F7F7F8",
          border: "#E5E5E5",
          text: "#1A1A1A",
          muted: "#6B7280",
          success: "#16A34A",
          danger: "#DC2626",
          warning: "#EAB308",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
