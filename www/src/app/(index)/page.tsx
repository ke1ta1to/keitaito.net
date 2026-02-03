import { ActivityList } from "@/features/landing-page/components/activity-list";
import { activitiesList, skillsList } from "@/orval/server";

export default async function IndexPage() {
  const activities = await activitiesList();
  const skills = await skillsList();

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world</h1>
      <ActivityList activities={activities} />
      <pre>{JSON.stringify(skills, null, 2)}</pre>
    </div>
  );
}
