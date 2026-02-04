import { Header } from "@/components/layouts/header";
import { ActivitiesList } from "@/features/landing-page/components/activities-list";
import { Profile } from "@/features/landing-page/components/profile";
import { SkillsList } from "@/features/landing-page/components/skills-list";
import { activitiesList, profileGet, skillsList } from "@/orval/server";

export default async function IndexPage() {
  const activities = await activitiesList();
  const skills = await skillsList();
  const profile = await profileGet();

  return (
    <div>
      <Header />
      <h1 className="text-3xl font-bold underline">Hello world</h1>
      <ActivitiesList activities={activities} />
      <SkillsList skills={skills} />
      <Profile profile={profile} />
    </div>
  );
}
