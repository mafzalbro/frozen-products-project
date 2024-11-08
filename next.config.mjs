/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "dummyimage.com",
  //     },
  //   ],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // experimental: {
  //   missingSuspenseWithCSRBailout: false,
  // },
};

export default nextConfig;
