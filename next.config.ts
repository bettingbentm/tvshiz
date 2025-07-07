import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['image.tmdb.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
    ],
  },
  experimental: {
    esmExternals: true,
  },
  // Enable server-side rendering for API routes
  serverExternalPackages: ['@netlify/functions'],
};

export default nextConfig;
