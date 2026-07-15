import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
