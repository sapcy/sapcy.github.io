/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@sapcy/web-sealedsecret/dist/**/*.{js,jsx,ts,tsx}',
    './node_modules/@sapcy/web-kube-cert/dist/**/*.{js,jsx,ts,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
