/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["faradey.logixvps.cloud", "faradeyapi.logixcommerce.com"],
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "faradey.logixvps.cloud",
  //       port: "3460",
  //       pathname: "/assets/uploads/**",
  //     },
  //   ],
  //  " http://faradey.logixvps.cloud:3460//assets/uploads/team/1.webp"
  // },
};

module.exports = nextConfig;
