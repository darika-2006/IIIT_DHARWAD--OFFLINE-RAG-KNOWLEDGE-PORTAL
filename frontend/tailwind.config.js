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
        'radar-green': '#10b981', // Emerald 500 equivalent, tweaking for "Signal Green"
        'avionics-blue': '#0ea5e9', // Sky 500
        'alert-amber': '#f59e0b', // Amber 500
        'slate-900': '#0f172a',
        'slate-800': '#1e293b',
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', 'monospace'],
        'sans': ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'hex-mesh': "url('/assets/hex-mesh.png')", // Plan to use CSS gradients if image not available
        'radar-sweep': "conic-gradient(from 0deg at 50% 50%, rgba(14, 165, 233, 0) 0deg, rgba(14, 165, 233, 0.1) 360deg)",
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(14, 165, 233, 0.5)',
        'neon-green': '0 0 10px rgba(16, 185, 129, 0.5)',
      },
    },
  },
  plugins: [],
}
