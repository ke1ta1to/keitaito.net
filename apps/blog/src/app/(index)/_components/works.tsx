import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkMetadata } from "@/lib/works";

export interface WorksProps {
  works: Array<WorkMetadata>;
}

export function Works(props: WorksProps) {
  const { works } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Works</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {works.map((work) => (
            <Link
              key={work.slug}
              href={`/works/${work.slug}`}
              className="ring-foreground/10 group flex flex-col ring-1"
            >
              <Image
                alt={`${work.title} thumbnail`}
                src={work.thumbnail}
                className="aspect-video object-cover"
              />
              <div className="flex flex-col gap-1 p-2.5">
                <h3 className="text-sm font-medium group-hover:underline">
                  {work.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2 text-xs">
                  {work.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
