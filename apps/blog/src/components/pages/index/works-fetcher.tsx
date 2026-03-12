import { WorkCard, Works } from "@repo/ui/components/works";

import { apiClient } from "@/lib/api-client";

export async function WorksFetcher() {
  const { data } = await apiClient.GET("/works");
  if (!data) return null;
  return (
    <Works>
      {data.map((work) => (
        <a key={work.id} href={`/works/${work.slug}`}>
          <WorkCard title={work.title} thumbnailUrl={work.thumbnail_url} />
        </a>
      ))}
    </Works>
  );
}
