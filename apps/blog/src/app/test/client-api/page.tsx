"use client";

import { Button } from "@repo/ui/components/ui/button";
import { useState } from "react";

export default function TestClientApiPage() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const res = await fetch(
      `/api/activities?title=${new Date().toLocaleString()}`,
    );
    const data = await res.json();
    setData(data);
  };

  return (
    <div>
      <h1>Test API Page</h1>
      <Button onClick={fetchData}>Fetch Data</Button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
