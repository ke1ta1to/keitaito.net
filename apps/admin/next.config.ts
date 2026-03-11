import * as path from "path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["@repo/ui"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  basePath: "/admin",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
