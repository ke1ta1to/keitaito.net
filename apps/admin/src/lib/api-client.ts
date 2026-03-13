import { createApiClient } from "@repo/api-client/client";

import {
  fetchAuthSession,
  getAccessToken,
  signInWithRedirect,
} from "@/lib/auth";

export const apiClient = createApiClient({ baseUrl: "/api" });

apiClient.use({
  async onRequest({ request }) {
    const token = await getAccessToken();
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  },
  async onResponse({ response }) {
    if (response.status === 401) {
      try {
        const session = await fetchAuthSession({ forceRefresh: true });
        if (session.tokens?.accessToken) {
          return response;
        }
      } catch {
        // refresh failed
      }
      await signInWithRedirect();
    }
    return response;
  },
});
