/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 60 * 60 * 24,
      static: 60 * 60 * 24,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ecommerce.routemisr.com',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
  async redirects() {
    return [
      {
        source: "/profile",
        destination: "/profile/accountUser",
        permanent: true,
      },
      {
        source: "/allorders",
        destination: "/profile/allorders",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

