import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@sapcy/web-sealedsecret/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@sapcy/web-sealedsecret/src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@sapcy/web-kube-cert/dist/**/*.{js,ts,jsx,tsx}',
    '../web-kube-cert/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans KR', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
