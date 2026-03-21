import { WorkCard, Works } from "@repo/ui/components/works";
import Link from "next/link";

import { apiClient } from "@/lib/api-client";

export async function WorksFetcher() {
  const { data } = await apiClient.GET("/works");
  if (!data) return null;
  return (
    <Works>
      {data.map((work) => (
        <Link key={work.id} href={`/works/${work.slug}`}>
          <WorkCard title={work.title} thumbnailUrl={work.thumbnail_url} />
        </Link>
      ))}
    </Works>
  );
}
