"use client";

import { WorkCard, Works } from "@repo/ui/components/works";
import { useQuery } from "@tanstack/react-query";

import { WorksList } from "./_components/works-list";

import { PreviewLayout } from "@/components/preview-layout";
import { apiClient } from "@/lib/api-client";

export default function WorksPage() {
  const { data } = useQuery({
    queryKey: ["works"],
    queryFn: () => apiClient.GET("/works").then((r) => r.data ?? []),
  });

  const works = data ?? [];

  return (
    <PreviewLayout
      preview={
        <Works>
          {works.map((work) => (
            <WorkCard
              key={work.id}
              title={work.title}
              thumbnailUrl={work.thumbnail_url}
            />
          ))}
        </Works>
      }
    >
      <WorksList works={works} />
    </PreviewLayout>
  );
}
