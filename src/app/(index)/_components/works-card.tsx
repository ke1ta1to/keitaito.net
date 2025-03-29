import { OverviewCard } from "@/components/overview-card";

export function WorksCard() {
  return (
    <OverviewCard title="Works">
      <div className="prose max-w-none">
        <h2>My Works</h2>
        <p>
          Here are some of the projects I have worked on. You can find the
          source code and more details on my GitHub profile.
        </p>
      </div>
    </OverviewCard>
  );
}
