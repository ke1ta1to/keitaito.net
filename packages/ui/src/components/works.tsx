import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export interface WorksProps {
  works?: {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail_url?: string | null;
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
                {work.thumbnail_url ? (
                  <Image
                    alt={work.title}
                    src={work.thumbnail_url}
                    width={640}
                    height={360}
                    className="aspect-video w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="bg-muted aspect-video w-full" />
                )}
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

export function WorksSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Works</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }, (_, i) => (
            <li key={i}>
              <Card>
                <Skeleton className="aspect-video w-full" />
                <CardHeader>
                  <Skeleton className="h-5 w-24" />
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
