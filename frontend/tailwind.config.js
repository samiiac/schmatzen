/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: "#171717",
        text: "#f5f5f5",
        muted: "#737373",
        accent: "#d4af37",
      },
    },
  },
  plugins: [],
};
