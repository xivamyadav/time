/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06080C',
          900: '#0A0D14',
          800: '#121622',
          700: '#1A202F',
          600: '#232A3D',
          500: '#2F3850',
        },
        slate: {
          400: '#8A93A6',
          300: '#AEB6C4',
        },
        amber: {
          400: '#4F46E5', // Indigo-600 matching BuzzHire
          500: '#4338CA',
        },
        mint: {
          400: '#10B981',
          500: '#059669',
        },
        coral: {
          400: '#EF4444',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.08) inset, 0 12px 32px -8px rgba(0,0,0,0.7)',
        glow: '0 0 0 1px rgba(255,184,0,0.25), 0 0 24px -4px rgba(255,184,0,0.4)',
      },
    },
  },
  plugins: [],
}
