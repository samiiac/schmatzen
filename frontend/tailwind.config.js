/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0c0118",
        surface: "#1a0a2e",
        surface2: "#231040",
        surface3: "#2d1b4e",
        text: "#f3e8ff",
        muted: "#a78bfa",
        accent: "#e879f9",
        accent2: "#f472b6",
        accent3: "#a78bfa",
        highlight: "#f0abfc",
        success: "#4ade80",
        danger: "#f87171",
        warning: "#fbbf24",
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        branding: ['"Playwrite DE Grund"', 'cursive'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
      },
      boxShadow: {
        glow: '0 0 30px rgba(232,121,249,0.25)',
        'glow-lg': '0 0 60px rgba(232,121,249,0.35)',
        card: '0 4px 24px rgba(0,0,0,0.5)',
        'card-hover': '0 8px 40px rgba(232,121,249,0.2)',
      },
    },
  },
  plugins: [],
};
