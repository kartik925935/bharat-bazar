import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.102'],
  images: {
    remotePatterns: [
      // Allow any HTTPS image host — needed for user-provided blog cover images
      {
        protocol: 'https',    
        hostname: '**',
      },
      // Allow http for local dev only
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
