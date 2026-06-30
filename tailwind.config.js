/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Restrained single accent: a calm clay/terracotta that reads well on
        // both light and dark surfaces and avoids the generic "bootstrap blue".
        accent: {
          50: '#fdf4ef',
          100: '#fae5d8',
          200: '#f4c8b0',
          300: '#eca37e',
          400: '#e27a4d',
          500: '#d65d2e',
          600: '#c4471f',
          700: '#a3361b',
          800: '#832d1c',
          900: '#6b281a',
        },
        ink: {
          DEFAULT: '#1c1917',
          soft: '#44403c',
          faint: '#78716c',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        reading: '68ch',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
