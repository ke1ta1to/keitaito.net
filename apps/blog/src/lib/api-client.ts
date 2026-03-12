import { createApiClient } from "@repo/api-client/client";

export const apiClient = createApiClient({
  baseUrl: process.env.API_URL,
});
