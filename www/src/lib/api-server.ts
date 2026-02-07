import { paths } from "@/schema";
import createClient from "openapi-fetch";
import { getServiceAccessToken } from "./cognito-client-credentials";

const apiClient = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});

apiClient.use({
  async onRequest({ request }) {
    const accessToken = await getServiceAccessToken();
    if (accessToken) {
      request.headers.set("Authorization", `Bearer ${accessToken}`);
    }
  },
  onResponse({ response }) {
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }
  },
});

export { apiClient };
