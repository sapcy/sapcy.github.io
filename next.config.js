/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages uses subpath, uncomment if needed
  // basePath: '',
  // assetPrefix: '',
}

module.exports = nextConfig
