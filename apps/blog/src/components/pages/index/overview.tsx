import { ActivitiesSkeleton } from "@repo/ui/components/activities";
import { ArticlesSkeleton } from "@repo/ui/components/articles";
import { ContactSkeleton } from "@repo/ui/components/contact";
import { ProfileSkeleton } from "@repo/ui/components/profile";
import { SkillsSkeleton } from "@repo/ui/components/skills";
import { WorksSkeleton } from "@repo/ui/components/works";
import { Suspense } from "react";

import { ActivitiesFetcher } from "./activities-fetcher";
import { ArticlesFetcher } from "./articles-fetcher";
import { ContactFetcher } from "./contact-fetcher";
import { ProfileFetcher } from "./profile-fetcher";
import { SkillsFetcher } from "./skills-fetcher";
import { WorksFetcher } from "./works-fetcher";

export async function Overview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-1 md:order-0">
          <Suspense fallback={<ProfileSkeleton />}>
            <ProfileFetcher />
          </Suspense>
        </div>
        <div className="order-2 md:order-0">
          <Suspense fallback={<ActivitiesSkeleton />}>
            <ActivitiesFetcher />
          </Suspense>
        </div>
        <div className="order-6 md:order-0">
          <Suspense fallback={<ContactSkeleton />}>
            <ContactFetcher />
          </Suspense>
        </div>
      </div>
      <div className="contents space-y-0 md:block md:space-y-4">
        <div className="order-3 md:order-0">
          <Suspense fallback={<WorksSkeleton />}>
            <WorksFetcher />
          </Suspense>
        </div>
        <div className="order-4 md:order-0">
          <Suspense fallback={<ArticlesSkeleton />}>
            <ArticlesFetcher />
          </Suspense>
        </div>
        <div className="order-5 md:order-0">
          <Suspense fallback={<SkillsSkeleton />}>
            <SkillsFetcher />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
