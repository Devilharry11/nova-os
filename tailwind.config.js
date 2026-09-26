/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#04060d',
          900: '#070913',
          850: '#0c0f20',
          800: '#12162d',
          700: '#1b203d',
          600: '#282f56',
        },
        vault: {
          rose: '#e05a88',
          blush: '#ff8fa3',
          gold: '#e8a598',
          violet: '#9d72ff',
          dusk: '#241a38',
          starlight: '#fdfbf7',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'glow-rose': '0 0 25px rgba(224, 90, 136, 0.35), 0 0 60px rgba(224, 90, 136, 0.15)',
        'glow-violet': '0 0 25px rgba(157, 114, 255, 0.35), 0 0 60px rgba(157, 114, 255, 0.15)',
        'glow-gold': '0 0 25px rgba(232, 165, 152, 0.35), 0 0 60px rgba(232, 165, 152, 0.15)',
        'vault-card': '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'portal': '0 0 80px rgba(224, 90, 136, 0.4), inset 0 0 60px rgba(157, 114, 255, 0.3)',
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite alternate',
        'spin-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%': { opacity: '0.4', transform: 'scale(0.98)' },
          '100%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}
