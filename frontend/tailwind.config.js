/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#000000',
        'dark-card': '#1a1a1a',
        'dark-border': '#333333',
        'dark-input': '#1a1a1a',
        'dark-input-focus': '#2a2a2a',
        'accent-green': '#51cf66',
        'accent-green-dark': '#1a2a1a',
        'error-red': '#ff6b6b',
        'error-red-dark': '#2a1a1a',
      },
      animation: {
        'pulse-slow': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

