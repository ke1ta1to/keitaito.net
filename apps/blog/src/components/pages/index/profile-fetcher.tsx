import { Profile } from "@repo/ui/components/profile";

import { apiClient } from "@/lib/api-client";

export async function ProfileFetcher() {
  const { data } = await apiClient.GET("/profile");
  return <Profile profile={data} />;
}
