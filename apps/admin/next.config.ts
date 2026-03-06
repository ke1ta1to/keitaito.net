import * as path from "path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
