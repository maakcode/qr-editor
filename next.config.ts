import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  reactCompiler: true,
  basePath: isProd ? "/qr-editor" : undefined,
  assetPrefix: isProd ? "/qr-editor/" : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
