import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface WorksProps {
  works?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail_url: string;
  }[];
}

export function Works(props: WorksProps) {
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
                  src={work.thumbnail_url}
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
