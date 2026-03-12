import { Activities } from "@repo/ui/components/activities";

import { apiClient } from "@/lib/api-client";

export async function ActivitiesFetcher() {
  const { data } = await apiClient.GET("/activities");
  return <Activities activities={data} />;
}
