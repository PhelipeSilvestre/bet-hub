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
          DEFAULT: '#026e3f', // Verde bet365
          600: '#015c34',
          700: '#014a2a',
          800: '#013720',
        },
        secondary: {
          DEFAULT: '#ffc800', // Amarelo bet365
          600: '#e0b000',
          700: '#c69a00',
          800: '#ab8400',
        },
        background: {
          DEFAULT: '#1a1a1a', // Fundo escuro bet365
          light: '#242424',
          lighter: '#333333',
          dark: '#0e0e0e',
        },
        accent: {
          DEFAULT: '#ffc800',
          foreground: '#000000',
        },
        bet: {
          odd: '#383838', // Cor de fundo dos botões de odds
          oddHover: '#444444',
          header: '#026e3f', // Verde do header principal
          nav: '#1a1a1a', // Cor de fundo da navegação
          card: '#242424', // Cor de fundo dos cards
          border: '#333333', // Cor das bordas
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}