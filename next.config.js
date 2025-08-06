/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react', 'react-dom'],
  webpack: (config, { isServer }) => {
    // Add @ alias support
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');

    // Prevent 'fs' errors in client builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
