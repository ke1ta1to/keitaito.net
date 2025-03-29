import { ActivitiesCard } from "./_components/activities-card";
import { ArticlesCard } from "./_components/articles-card";
import { ContactCard } from "./_components/contact-card";
import { ProfileCard } from "./_components/profile-card";
import { SkillsCard } from "./_components/skills-card";
import { WorksCard } from "./_components/works-card";

export default async function IndexPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-1 md:order-none">
          <ProfileCard />
        </div>
        <div className="order-2 md:order-none">
          <ActivitiesCard />
        </div>
        <div className="order-6 md:order-none">
          <ContactCard />
        </div>
      </div>
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-3 md:order-none">
          <ArticlesCard />
        </div>
        <div className="order-4 md:order-none">
          <WorksCard />
        </div>
        <div className="order-5 md:order-none">
          <SkillsCard />
        </div>
      </div>
    </div>
  );
}
