import type { MetadataRoute } from "next";

import { getEnv } from "@/lib/env-vars";

export default function robots(): MetadataRoute.Robots {
  const url = new URL(getEnv().customUrl);
  url.pathname = "/sitemap.xml";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/_next/static/"],
    },
    sitemap: url.toString(),
  };
}
