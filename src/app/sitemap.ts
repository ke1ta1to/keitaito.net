import type { MetadataRoute } from "next";

import { works } from "@/data/works";
import { getEnv } from "@/lib/env-vars";

export default function sitemap(): MetadataRoute.Sitemap {
  const { customUrl } = getEnv();
  return [
    {
      url: new URL("/", customUrl).toString(),
      lastModified: new Date(),
    },
    {
      url: new URL("/articles", customUrl).toString(),
      lastModified: new Date(),
    },
    {
      url: new URL("/works", customUrl).toString(),
      lastModified: new Date(),
    },
    {
      url: new URL("/contact", customUrl).toString(),
      lastModified: new Date(),
    },
    ...works.map<MetadataRoute.Sitemap[number]>((work) => ({
      url: new URL(work.url, customUrl).toString(),
      lastModified: new Date(),
    })),
  ];
}
