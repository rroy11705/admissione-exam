/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  images: {
    domains: ['localhost', 'api.sconto.ai', 'sconto.ai', 'dev-api.sconto.ai'],
  },
};

module.exports = nextConfig;
