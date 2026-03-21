import { createApiClient } from "@repo/api-client/client";

export const apiClient = createApiClient({
  baseUrl: "/api",
});
