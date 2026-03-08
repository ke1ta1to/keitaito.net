import * as path from "path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/ui"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      const apiUrl = process.env.API_URL;
      return [{ source: "/api/:path*", destination: `${apiUrl}:path*` }];
    }
    return [];
  },
};

export default nextConfig;
