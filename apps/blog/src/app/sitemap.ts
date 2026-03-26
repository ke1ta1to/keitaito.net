import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants";
import { getAllWorks } from "@/lib/works";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const works = await getAllWorks();

  const workEntries: MetadataRoute.Sitemap = works.map((work) => ({
    url: `${SITE_URL}/works/${work.slug}`,
    lastModified: new Date(work.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    ...workEntries,
  ];
}
