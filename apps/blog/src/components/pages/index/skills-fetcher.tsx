import { Skills } from "@repo/ui/components/skills";

import { apiClient } from "@/lib/api-client";

export async function SkillsFetcher() {
  const { data } = await apiClient.GET("/skills");
  return <Skills skills={data} />;
}
