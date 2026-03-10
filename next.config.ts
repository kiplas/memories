import type { NextConfig } from "next";

const nextConfig = async (phase: string, { defaultConfig }: { defaultConfig: NextConfig }): Promise<NextConfig> => {
  return {
    ...defaultConfig,
    reactStrictMode: true,
    output: "standalone",
  };
};

export default nextConfig;
