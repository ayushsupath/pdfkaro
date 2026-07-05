export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#ffe17c',
          charcoal: '#171e19',
          sage: '#b7c6c2',
        },
        ui: '#ffffff',
        ink: '#000000',
      },
      fontFamily: {
        heading: ['"Cabinet Grotesk"', 'sans-serif'],
        body: ['"Satoshi"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'hard-sm': '4px 4px 0px 0px #000000',
        'hard-lg': '8px 8px 0px 0px #000000',
        'hard-xl': '12px 12px 0px 0px #000000',
      },
      borderWidth: {
        DEFAULT: '2px',
      },
    },
  },
  plugins: [],
}
