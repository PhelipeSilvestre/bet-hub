/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006241', // Verde bet365 mais forte
          600: '#00543a',
          700: '#004530',
          800: '#003626',
        },
        secondary: {
          DEFAULT: '#ffc800', // Amarelo bet365
          600: '#e0b000',
          700: '#c69a00',
          800: '#ab8400',
        },
        background: {
          DEFAULT: '#151515', // Fundo escuro bet365
          light: '#1e1e1e',
          lighter: '#292929',
          dark: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#ffc800',
          foreground: '#000000',
        },
        bet: {
          odd: '#292929', // Cor de fundo dos botões de odds
          oddHover: '#333333',
          header: '#006241', // Verde do header principal
          nav: '#151515', // Cor de fundo da navegação
          card: '#1e1e1e', // Cor de fundo dos cards
          border: '#292929', // Cor das bordas
          highlight: '#ffdf1b', // Amarelo para destaques
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}