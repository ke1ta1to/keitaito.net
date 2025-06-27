import Image from "next/image";
import Link from "next/link";

import { OverviewCard } from "@/components/overview-card";
import type { WorkMetadata } from "@/lib/works";

interface WorksCardProps {
  works: WorkMetadata[];
}

export function WorksCard({ works }: WorksCardProps) {
  return (
    <OverviewCard title="Works">
      <div>
        {works.map((work) => (
          <Link
            className="group flex items-center gap-4 p-2"
            key={work.title}
            href={work.url}
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              {...work.thumbnail}
              className="aspect-4/3 w-16 shrink-0 rounded object-cover"
            />
            <div className="flex-1">
              <h3 className="group-hover:underline">{work.title}</h3>
              <div className="prose prose-sm">{work.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </OverviewCard>
  );
}
