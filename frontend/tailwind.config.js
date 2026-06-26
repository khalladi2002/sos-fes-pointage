/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sos: {
          dark: '#0B3D66',   // bleu foncé
          blue: '#114B7D',
          green: '#1F9D55',  // vert SOS
          greenDark: '#177A41',
          white: '#FFFFFF',
          gray: '#F4F6F8'
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
