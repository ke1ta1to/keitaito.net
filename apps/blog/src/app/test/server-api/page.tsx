import { createApiClient } from "@repo/api-client/client";

export const dynamic = "force-dynamic";

const apiClient = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export default async function TestServerApiPage() {
  const res = await apiClient.GET("/activities");
  const data = res.error ? null : res.data;
  return (
    <div>
      <h1>Test API Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
