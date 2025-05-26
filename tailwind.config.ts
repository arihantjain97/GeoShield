import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: '#e2e8f0',
        input: '#e2e8f0',
        background: '#ffffff',
        foreground: '#0f172a',
        primary: '#0f172a',
        secondary: '#f1f5f9',
        muted: '#f1f5f9',
        accent: '#f8fafc',
      },
    },
  },
  plugins: [],
};

export default config;