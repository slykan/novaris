import type { NextConfig } from "next";

// Promijeni u '' kada bude prava domena
const base = '/~novaris'

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: base,
  assetPrefix: base,
};

export default nextConfig;
