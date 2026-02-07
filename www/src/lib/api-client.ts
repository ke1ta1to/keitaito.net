import { paths } from "@/schema";
import { fetchAuthSession } from "aws-amplify/auth";
import createClient from "openapi-fetch";

const apiClient = createClient<paths>({
  baseUrl: "/api",
});

apiClient.use({
  async onRequest({ request }) {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken?.toString();
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
