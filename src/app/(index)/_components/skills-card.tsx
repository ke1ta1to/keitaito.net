import { OverviewCard } from "@/components/overview-card";

export function SkillsCard() {
  return (
    <OverviewCard title="Skills">
      <div className="prose max-w-none">
        <h2>My Skills</h2>
        <p>
          I have experience in various programming languages and technologies.
          Here are some of the key skills I possess:
        </p>
        <ul>
          <li>JavaScript/TypeScript</li>
          <li>Python</li>
          <li>React</li>
          <li>Node.js</li>
          <li>Next.js</li>
          <li>GraphQL</li>
          <li>Docker</li>
        </ul>
      </div>
    </OverviewCard>
  );
}
