import { OverviewCard } from "@/components/overview-card";

export function ArticlesCard() {
  return (
    <OverviewCard title="Articles">
      <div className="prose max-w-none">
        <h2>Latest Articles</h2>
        <p>
          Check out my latest articles on various topics related to programming,
          technology, and more.
        </p>
      </div>
    </OverviewCard>
  );
}
