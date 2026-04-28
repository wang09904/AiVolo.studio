import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: "/Users/wangyong/Documents/项目/AiVolo.studio",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;