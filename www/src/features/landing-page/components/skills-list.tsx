import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skill } from "@/orval";
import Image from "next/image";

export interface SkillsListProps {
  skills?: Skill[];
}

export function SkillsList(props: SkillsListProps) {
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
                className="h-8 w-8"
              />
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
