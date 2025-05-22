/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['froghub.nl'],
    unoptimized: true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.lua$/,
      use: 'raw-loader'
    });
    
    // Add case sensitivity handling
    config.resolve.symlinks = false;
    config.resolve.cacheWithContext = false;
    
    return config;
  },
  async redirects() {
    return [
      {
        source: '/tos',
        destination: '/#tos',
        permanent: true,
      },
    ];
  }
}

module.exports = nextConfig