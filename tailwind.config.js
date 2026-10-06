/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orbit: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36abf7',
          500: '#0073bc', // Orbit Primary Brand
          600: '#0267a8',
          700: '#025287',
          800: '#06466f',
          900: '#002f52', // Orbit Deep Navy
          950: '#051f38'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      boxShadow: {
        '3d-light': '0 20px 40px -15px rgba(0, 115, 188, 0.15), 0 0 20px 0 rgba(255, 255, 255, 0.8) inset',
        '3d-card': '0 25px 50px -12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8) inset',
        '3d-hover': '0 30px 60px -15px rgba(0, 115, 188, 0.25), 0 0 25px 0 rgba(255, 255, 255, 0.9) inset',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'wave': 'wave 10s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
