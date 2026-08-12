/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6c63ff',
          dark: '#5548e0',
          light: '#a29bfe',
        },
        accent: {
          DEFAULT: '#fd79a8',
          dark: '#e84393',
        },
        success: '#00b894',
        warning: '#fdcb6e',
        danger: {
          DEFAULT: '#d63031',
          light: '#ff7675',
        },
        info: '#0984e3',
        bg: {
          DEFAULT: '#0f0f1a',
          card: '#1a1a2e',
          elevated: '#16213e',
          hover: '#1e1e35',
        },
        customText: {
          DEFAULT: '#e2e8f0',
          muted: '#94a3b8',
          faint: '#475569',
          inverse: '#0f0f1a',
        },
      },
      borderColor: {
        custom: 'rgba(255,255,255,0.08)',
        customHover: 'rgba(108,99,255,0.4)',
      },
      boxShadow: {
        glow: '0 0 30px rgba(108,99,255,0.15)',
        card: '0 8px 32px rgba(0,0,0,0.3)',
        standard: '0 4px 24px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        customSm: '8px',
        customMd: '12px',
        customLg: '18px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        spinLinear: {
          to: { transform: 'rotate(360deg)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        spinLinear: 'spinLinear 0.8s linear infinite',
        slideUp: 'slideUp 0.2s ease',
      },
    },
  },
  plugins: [],
}
