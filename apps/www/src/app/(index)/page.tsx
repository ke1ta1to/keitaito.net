import { ActivitiesCard } from "./_components/activities-card";
import { ArticlesCard } from "./_components/articles-card";
import { ContactCard } from "./_components/contact-card";
import { JsonLd } from "./_components/json-lg";
import { ProfileCard } from "./_components/profile-card";
import { SkillsCard } from "./_components/skills-card";
import { WorksCard } from "./_components/works-card";

import { activities, contact, profile, skills } from "@/constants/data";
import { fetchArticles } from "@/lib/articles-fetcher";
import { getAllWorkMetadata } from "@/lib/works";

export const revalidate = 86_400; // 1日ごとに再検証

export default async function IndexPage() {
  const sortedActivities = activities.slice().reverse(); // 順番を逆にする
  const articles = await fetchArticles();

  const works = await getAllWorkMetadata();

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="contents space-y-0 md:block md:space-y-4">
          <div className="order-1 md:order-none">
            <ProfileCard profile={profile} />
          </div>
          <div className="order-2 md:order-none">
            <ActivitiesCard activities={sortedActivities} maxActivities={4} />
          </div>
          <div className="order-6 md:order-none">
            <ContactCard contact={contact} />
          </div>
        </div>
        <div className="contents space-y-0 md:block md:space-y-4">
          <div className="order-3 md:order-none">
            <ArticlesCard articles={articles} maxArticles={4} />
          </div>
          <div className="order-4 md:order-none">
            <WorksCard works={works} />
          </div>
          <div className="order-5 md:order-none">
            <SkillsCard skills={skills} />
          </div>
        </div>
      </div>
      <JsonLd />
    </>
  );
}
