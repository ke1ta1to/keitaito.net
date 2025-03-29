import { OverviewCard } from "@/components/overview-card";

export function ProfileCard() {
  return (
    <OverviewCard title="Overview">
      <div className="prose max-w-none">
        <h1>Welcome to keitaito.net</h1>
        <p>
          This is a personal website of Keita Ito, a software engineer based in
          Japan. I share my thoughts, experiences, and projects here.
        </p>
        <p>
          Feel free to explore my articles and works. If you have any questions
          or feedback, don&apos;t hesitate to reach out!
        </p>
      </div>
    </OverviewCard>
  );
}
