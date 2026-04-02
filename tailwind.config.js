/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'snack-pink': '#BF0FB4',
        'snack-medium-purple': '#48038C',
        'snack-dark-purple': '#2E0259',
        'snack-sky-blue': '#0798F2',
        'snack-aqua-blue': '#11C5D9',
      },
      fontFamily: {
        'cherry-bomb': ['CherryBombOne_400Regular'],
        'jost': ['Jost_400Regular'],
        'jost-bold': ['Jost_700Bold'],
      }
    },
  },
  plugins: [],
}

