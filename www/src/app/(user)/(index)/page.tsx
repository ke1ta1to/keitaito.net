import { ActivitiesList } from "@/features/landing-page/components/activities-list";
import { ArticlesList } from "@/features/landing-page/components/articles-list";
import { Contact } from "@/features/landing-page/components/contact";
import { Profile } from "@/features/landing-page/components/profile";
import { SkillsList } from "@/features/landing-page/components/skills-list";
import { WorksList } from "@/features/landing-page/components/works-list";
import { apiClient } from "@/lib/api-server";

export default async function IndexPage() {
  const [
    { data: activities },
    { data: skills },
    { data: profile },
    { data: works },
    { data: contact },
    { data: articles },
  ] = await Promise.all([
    apiClient.GET("/activities"),
    apiClient.GET("/skills"),
    apiClient.GET("/profile"),
    apiClient.GET("/works"),
    apiClient.GET("/contact"),
    apiClient.GET("/articles"),
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-1 md:order-0">
          <Profile profile={profile} />
        </div>
        <div className="order-2 md:order-0">
          <ActivitiesList activities={activities} />
        </div>
        <div className="order-6 md:order-0">
          <Contact contact={contact} />
        </div>
      </div>
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-3 md:order-0">
          <WorksList works={works} />
        </div>
        <div className="order-4 md:order-0">
          <ArticlesList articles={articles} />
        </div>
        <div className="order-5 md:order-0">
          <SkillsList skills={skills} />
        </div>
      </div>
    </div>
  );
}
