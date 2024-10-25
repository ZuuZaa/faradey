/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "faradey.logixvps.cloud",
        port: "3460",
        pathname: "/assets/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
