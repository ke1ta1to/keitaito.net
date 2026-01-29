import { activitiesList } from "@/orval/server";

export default async function IndexPage() {
  const activities = await activitiesList();
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world</h1>
      <p>Index</p>
      <pre>{JSON.stringify(activities, null, 2)}</pre>
    </div>
  );
}
