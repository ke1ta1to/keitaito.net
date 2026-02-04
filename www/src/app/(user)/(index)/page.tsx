import { ActivitiesList } from "@/features/landing-page/components/activities-list";
import { Profile } from "@/features/landing-page/components/profile";
import { SkillsList } from "@/features/landing-page/components/skills-list";
import { activitiesList, profileGet, skillsList } from "@/orval/server";

export default async function IndexPage() {
  const activities = await activitiesList();
  const skills = await skillsList();
  const profile = await profileGet();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-1 md:order-0">
          <Profile profile={profile} />
        </div>
        <div className="order-2 md:order-0">
          <ActivitiesList activities={activities} />
        </div>
      </div>
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-3 md:order-0">
          <SkillsList skills={skills} />
        </div>
      </div>
    </div>
  );
}
