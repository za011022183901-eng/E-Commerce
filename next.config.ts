import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // إضافة مهمة لتجنب توقف الـ Build بسبب تحذيرات الـ ESLint
  eslint: {
    ignoreDuringBuilds: true,
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