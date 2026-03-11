"use client";

import { createApiClient } from "@repo/api-client/client";
import type { components } from "@repo/api-client/schema";
import { Button } from "@repo/ui/components/ui/button";
import { useState } from "react";

const apiClient = createApiClient({
  baseUrl: "/api",
});

export default function TestClientApiPage() {
  const [data, setData] = useState<components["schemas"]["Activity"][] | null>(
    null,
  );

  const fetchData = async () => {
    const res = await apiClient.GET("/activities");
    if (!res.error) {
      setData(res.data);
    }
  };

  return (
    <div>
      <h1>Test API Page</h1>
      <Button onClick={fetchData}>Fetch Data</Button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
