import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Work } from "@/orval";
import Image from "next/image";

export interface WorksListProps {
  works?: Work[];
}

export function WorksList(props: WorksListProps) {
  const { works = [] } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Works</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 md:grid-cols-2">
          {works.map((work) => (
            <li key={work.id}>
              <Card>
                <Image
                  alt={work.title}
                  src={work.thumbnail}
                  width={640}
                  height={360}
                  className="aspect-video w-full object-cover"
                  unoptimized
                />
                <CardHeader>
                  <CardTitle>{work.title}</CardTitle>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
