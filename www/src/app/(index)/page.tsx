import { ActivityList } from "@/features/landing-page/components/activity-list";
import { activitiesList } from "@/orval/server";

export default async function IndexPage() {
  const activities = await activitiesList();
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world</h1>
      <ActivityList activities={activities} />
    </div>
  );
}
