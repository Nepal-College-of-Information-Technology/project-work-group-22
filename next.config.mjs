/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false, // defaults to true
  },
  // Skip type checking and linting during build for Docker
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Production build optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce bundle size
  transpilePackages: ['swagger-ui-react'],
  // Output configuration for better performance
  output: 'standalone',
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
