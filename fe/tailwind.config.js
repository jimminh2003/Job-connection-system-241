/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        indigo: 
        {
          500: '#6366fa',
          600: '#4F46E5',

        },
        background: "#ffffff",
        foreground: "#000000",
        muted: 
        {
          foreground: "#6b7280",
        },
        destructive: 
        {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        ring: "#3b82f6",
        input: "#e5e7eb",
        popover: 
        {
          DEFAULT: "#ffffff",
          foreground: "#000000",
        },
    },
  },
  },
  plugins: [
    require('tailwindcss-motion')
  ],
}