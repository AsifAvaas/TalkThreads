/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile-view': '360px',
        'mobile-large-view': '415px',

      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/forms'),

  ],

}

