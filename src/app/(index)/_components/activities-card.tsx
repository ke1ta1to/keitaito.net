import { OverviewCard } from "@/components/overview-card";

export function ActivitiesCard() {
  return (
    <OverviewCard title="Activities">
      <div className="prose max-w-none">
        <h2>My Activities</h2>
        <p>
          I am actively involved in various activities related to software
          development, open source contributions, and community engagement.
        </p>
        <p>
          You can find more details about my activities on my GitHub profile and
          other platforms.
        </p>
      </div>
    </OverviewCard>
  );
}
