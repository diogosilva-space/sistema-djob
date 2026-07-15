import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    qualities: [75, 85],
  },
};

export default nextConfig;
