import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f0f0f',
        secondary: '#1a1a1a',
        accent: '#ff6b35',
        'accent-hover': '#ff8555',
        success: '#00d4aa',
        'text-primary': '#ffffff',
        'text-secondary': '#888888',
        border: '#333333',
        danger: '#ff4757',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
export default config
