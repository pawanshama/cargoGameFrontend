/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lato: ['"Lato"', ...defaultTheme.fontFamily.sans],
        designer: ['"Designer"', ...defaultTheme.fontFamily.sans],
        ailerons: ['"Ailerons"', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'button': 'linear-gradient(180deg, #348471 0%, #2BC77B 100%)',
        'gradientSecond': 'linear-gradient(180deg, rgba(56, 30, 87, 0.00) 35.87%, #07CBE9 145%)',
        'gradientFirst': 'linear-gradient(180deg, rgba(56, 30, 87, 0.00) 5.84%, #C8BD15 130%)',
        'gradientThird': 'linear-gradient(180deg, rgba(56, 30, 87, 0.00) 35.87%, #E8720A 145%)',
        'radialGradient': 'radial-gradient(50% 50% at 50% 50%, rgba(62, 8, 66, 0.60) 0%, rgba(31, 7, 69, 0.60) 100%)',
        'buttonSecondary': 'linear-gradient(232deg, #FD0BAB 18.09%, #CAE00F 82.72%)',
      },
      colors: {
        'secondary': '#9752B8',
        'primary': '#2AFD95',
        'alternateBackground': '#00000066',
        'textColor': '#F0EEF1',
        'disabled': '#8B848E',
        'blurBackground': '#25102FE5',
        'activeTab': '#4F2263',
        'inActiveTab': '#EE227A',
        'tableRow': '#FFFFFF1A',
      },
      keyframes: {
        pulseFade: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        orbitPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        pulseZoom: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        },
        luckyRoll: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        luckyShake: {
          '0%': { transform: 'rotate(0deg) translateX(0)' },
          '5%': { transform: 'rotate(-6deg) translateX(-4px)' },
          '10%': { transform: 'rotate(6deg) translateX(4px)' },
          '15%': { transform: 'rotate(-5deg) translateX(-3px)' },
          '20%': { transform: 'rotate(5deg) translateX(3px)' },
          '25%': { transform: 'rotate(-4deg) translateX(-2px)' },
          '30%': { transform: 'rotate(4deg) translateX(2px)' },
          '35%': { transform: 'rotate(-3deg) translateX(-2px)' },
          '40%': { transform: 'rotate(3deg) translateX(2px)' },
          '45%': { transform: 'rotate(-2deg) translateX(-1px)' },
          '50%': { transform: 'rotate(2deg) translateX(1px)' },
          '55%': { transform: 'rotate(0deg) translateX(0)' },
          '100%': { transform: 'rotate(0deg) translateX(0)' },
        },
        fadeSlide: {
          '0%': { opacity: 0, transform: 'translateY(-8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'pulse-fade': 'pulseFade 1.8s ease-in-out infinite',
        'pulse-orbit': 'orbitPulse 3s ease-in-out infinite',
        'pulse-zoom': 'pulseZoom 1.5s ease-in-out infinite',
        'lucky-roll': 'luckyRoll 1.5s ease-in-out infinite',
        'lucky-shake': 'luckyShake 3s ease-in-out infinite',
        'fade-slide': 'fadeSlide 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
