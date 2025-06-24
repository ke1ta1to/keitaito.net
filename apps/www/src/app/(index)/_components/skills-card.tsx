import Image from "next/image";

import { OverviewCard } from "@/components/overview-card";
import type { Skills } from "@/constants/data";

interface SkillsCardProps {
  skills: Skills;
}

export function SkillsCard({ skills }: SkillsCardProps) {
  return (
    <OverviewCard title="Skills">
      <ul className="flex flex-wrap gap-4">
        {skills.special.map((skill) => (
          <li key={skill.label} className="rounded p-2 shadow-sm">
            <Image
              alt={skill.label}
              src={skill.src}
              width={128}
              height={128}
              className="h-auto w-10"
            />
          </li>
        ))}
      </ul>
      <ul className="mt-4 flex flex-wrap gap-4">
        {skills.lang.map((skill) => (
          <li key={skill.label} className="rounded p-2 shadow-sm">
            <Image
              alt={skill.label}
              src={skill.src}
              width={128}
              height={128}
              className="h-auto w-8"
            />
          </li>
        ))}
      </ul>
    </OverviewCard>
  );
}
