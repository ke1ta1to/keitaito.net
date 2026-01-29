import { getServiceAccessToken } from "@/lib/cognito-client-credentials";

export default async function IndexPage() {
  const token = await getServiceAccessToken();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiUrl = `${apiBaseUrl}/activities`;

  const res = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch activities");
  }

  const activities = await res.json();

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world</h1>
      <p>Index</p>
      <pre>{JSON.stringify(activities, null, 2)}</pre>
    </div>
  );
}
