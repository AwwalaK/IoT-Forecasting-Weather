module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
     extend: {
      backgroundImage: {
        'sunny-background': "url('/src/assets/image/backgroundSunny.jpeg')",
        'rainy-background': "url('/src/assets/image/backgroundRainy.jpeg')",
        'about-background': "url('/src/assets/image/backgroundAbout.jpg')",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
