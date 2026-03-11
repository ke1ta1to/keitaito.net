import { Activities } from "@repo/ui/components/activities";

export async function ActivitiesFetcher() {
  const res = await fetch(`${process.env.API_URL}activities`);
  const data = await res.json();
  return <Activities activities={data} />;
}
