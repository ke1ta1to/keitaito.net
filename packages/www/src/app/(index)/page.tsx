import { activitiesList } from "@/gen/api/endpoints/activities/activities";
import { getServiceAccessToken } from "@/lib/cognito-client-credentials";

export default async function IndexPage() {
  const token = await getServiceAccessToken();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const activities = await activitiesList({
    headers: { Authorization: `Bearer ${token})` },
    baseURL: apiBaseUrl,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world</h1>
      <p>Index</p>
      <pre>{JSON.stringify(activities, null, 2)}</pre>
    </div>
  );
}
