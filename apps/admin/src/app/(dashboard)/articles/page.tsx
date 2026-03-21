"use client";

import { Articles } from "@repo/ui/components/articles";
import { useQuery } from "@tanstack/react-query";

import { ArticlesList } from "./_components/articles-list";

import { PreviewLayout } from "@/components/preview-layout";
import { apiClient } from "@/lib/api-client";

export default function ArticlesPage() {
  const { data } = useQuery({
    queryKey: ["articles"],
    queryFn: () => apiClient.GET("/articles").then((r) => r.data ?? []),
  });

  const articles = data ?? [];

  return (
    <PreviewLayout preview={<Articles articles={articles} />}>
      <ArticlesList articles={articles} />
    </PreviewLayout>
  );
}
