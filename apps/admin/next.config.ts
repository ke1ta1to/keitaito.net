import * as path from "path";

import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/dist/shared/lib/constants";

const nextConfig = (phase: string): NextConfig => ({
  output: phase === PHASE_DEVELOPMENT_SERVER ? undefined : "export",
  transpilePackages: ["@repo/api-client", "@repo/ui"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  basePath: "/admin",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      const apiUrl = process.env.API_URL;
      const uploadsUrl = process.env.UPLOADS_URL;
      return [
        {
          source: "/api/:path*",
          destination: `${apiUrl}:path*`,
          basePath: false,
        },
        {
          source: "/uploads/:path*",
          destination: `${uploadsUrl}:path*`,
          basePath: false,
        },
      ];
    }
    return [];
  },
});

export default nextConfig;
