/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void-black': '#020617',
        'radar-green': '#10b981', 
        'avionics-blue': '#0ea5e9', 
        'alert-amber': '#f59e0b', 
        'slate-900': '#0f172a',
        'slate-800': '#1e293b',
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', 'monospace'],
        'sans': ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'hex-mesh': "url('/assets/hex-mesh.png')",
        'radar-sweep': "conic-gradient(from 0deg at 50% 50%, rgba(14, 165, 233, 0) 0deg, rgba(14, 165, 233, 0.1) 360deg)",
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(14, 165, 233, 0.5)',
        'neon-green': '0 0 10px rgba(16, 185, 129, 0.5)',
      },
      // --- NEW ANIMATIONS ADDED HERE ---
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}