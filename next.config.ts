import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // S3: the old Squarespace paths keep their links and search equity.
  async redirects() {
    return [
      { source: '/eat', destination: '/menu', permanent: true },
      { source: '/drink', destination: '/menu#bar', permanent: true },
      { source: '/where-are-we', destination: '/visit', permanent: true },
      { source: '/gallery', destination: '/story#room', permanent: true },
      { source: '/visit-tremont', destination: '/visit', permanent: true },
      { source: '/home', destination: '/', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
