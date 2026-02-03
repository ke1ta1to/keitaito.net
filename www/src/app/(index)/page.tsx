import { ActivitiesList } from "@/features/landing-page/components/activities-list";
import { SkillsList } from "@/features/landing-page/components/skills-list";
import { activitiesList, skillsList } from "@/orval/server";

export default async function IndexPage() {
  const activities = await activitiesList();
  const skills = await skillsList();

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world</h1>
      <ActivitiesList activities={activities} />
      <SkillsList skills={skills} />
    </div>
  );
}
