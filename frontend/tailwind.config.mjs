/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F6F2',
          100: '#DFECE3',
          200: '#C2DBCB',
          300: '#9BC3AA',
          400: '#6FA784',
          500: '#488A62',
          600: '#34704E',
          700: '#2A583E',
          800: '#1F422F',
          900: '#142C20',
          950: '#0B1A12',
        },
        sage: {
          50: '#F5F7F6',
          100: '#E8ECE9',
          200: '#D2DCD5',
          300: '#B4C5BA',
          400: '#91AA9A',
          500: '#738F7D',
          600: '#587161',
          700: '#45594C',
          800: '#37473D',
          900: '#2D3A32',
        },
        earth: {
          50: '#FAF8F5',
          100: '#F4EFE8',
          200: '#E7DDD0',
          300: '#D6C5B2',
          400: '#BFA68E',
          500: '#A4866C',
          600: '#896C52',
          700: '#6E543E',
          800: '#554131',
          900: '#3D2F23',
        },
        clay: {
          100: '#FDEEE9',
          200: '#FBD8CD',
          300: '#F6B7A2',
          400: '#EE8869',
          500: '#DF5E3A',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(20, 44, 32, 0.06), 0 1px 4px -1px rgba(20, 44, 32, 0.04)',
        'medium': '0 4px 20px -2px rgba(20, 44, 32, 0.08), 0 2px 8px -2px rgba(20, 44, 32, 0.05)',
        'elevated': '0 12px 32px -4px rgba(20, 44, 32, 0.12), 0 4px 12px -2px rgba(20, 44, 32, 0.06)',
      }
    },
  },
  plugins: [],
};
