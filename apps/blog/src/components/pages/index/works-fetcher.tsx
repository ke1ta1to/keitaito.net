import { Works } from "@repo/ui/components/works";

import { apiClient } from "@/lib/api-client";

export async function WorksFetcher() {
  const { data } = await apiClient.GET("/works");
  return <Works works={data} />;
}
