/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Turn OFF strict mode

  webpack: (config, { dev, isServer }) => {
    // Completely ignore wallet adapter modules
    if (dev && !isServer) {
      config.ignoreWarnings = [
        /node_modules\/@solana\/wallet-adapter/,
        /node_modules\/@solana\/wallet-standard/,
      ];

      config.infrastructureLogging = {
        level: 'none', // No logging
      };
    }

    return config;
  },
};

module.exports = nextConfig;
