"use client";

import { createApiClient } from "@repo/api-client/client";
import { useQuery } from "@tanstack/react-query";

const apiClient = createApiClient({
  baseUrl: "/api",
});

export default function TestClientApiPage() {
  const { data } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => apiClient.GET("/activities").then((res) => res.data),
  });

  return (
    <div>
      <h1>Test API Page</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
