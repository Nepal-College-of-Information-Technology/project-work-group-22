/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false, // defaults to true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  // Suppress React strict mode warnings from swagger-ui-react
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // Suppress specific warnings from swagger-ui-react
    if (!isServer) {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        const message = args[0];
        if (
          typeof message === 'string' &&
          (message.includes('UNSAFE_componentWillReceiveProps') ||
           message.includes('componentWillReceiveProps'))
        ) {
          return;
        }
        originalWarn.apply(console, args);
      };
    }
    return config;
  },
};

export default nextConfig;
