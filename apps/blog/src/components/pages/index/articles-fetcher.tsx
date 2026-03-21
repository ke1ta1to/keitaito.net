import { Articles } from "@repo/ui/components/articles";

import { apiClient } from "@/lib/api-client";

export async function ArticlesFetcher() {
  const { data } = await apiClient.GET("/articles");
  return <Articles articles={data} />;
}
