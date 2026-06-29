import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
