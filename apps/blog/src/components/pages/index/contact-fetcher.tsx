import { Contact } from "@repo/ui/components/contact";

import { apiClient } from "@/lib/api-client";

export async function ContactFetcher() {
  const { data } = await apiClient.GET("/contact");
  return <Contact contact={data} />;
}
