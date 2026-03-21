import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export interface SkillsProps {
  skills?: {
    id: string;
    name: string;
    icon_url: string;
  }[];
}

export function Skills(props: SkillsProps) {
  const { skills = [] } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {skills.map((skill) => (
          <Card key={skill.id} className="py-2">
            <CardContent className="px-2">
              <Image
                alt={skill.name}
                src={skill.icon_url}
                width={128}
                height={128}
                className="size-8"
              />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

export function SkillsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Card key={i} className="py-2">
            <CardContent className="px-2">
              <Skeleton className="size-8" />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
