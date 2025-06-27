import type { MetadataRoute } from "next";

import { getEnv } from "@/lib/env-vars";
import { getWorkSlugs } from "@/lib/works";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { customUrl } = getEnv();

  const workSlugs = await getWorkSlugs();

  return [
    {
      url: new URL("/", customUrl).toString(),
      lastModified: new Date(),
    },
    // {
    //   url: new URL("/articles", customUrl).toString(),
    //   lastModified: new Date(),
    // },
    // {
    //   url: new URL("/works", customUrl).toString(),
    //   lastModified: new Date(),
    // },
    // {
    //   url: new URL("/contact", customUrl).toString(),
    //   lastModified: new Date(),
    // },
    ...workSlugs.map<MetadataRoute.Sitemap[number]>((slug) => ({
      url: new URL(`works/${slug}`, customUrl).toString(),
      lastModified: new Date(),
    })),
  ];
}
