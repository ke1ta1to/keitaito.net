import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { OverviewCard } from "@/components/overview-card";

export interface Work {
  thumbnail: string;
  title: string;
  description?: ReactNode;
  url: string;
}

interface WorksCardProps {
  works: Work[];
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
            <Image
              alt=""
              src={work.thumbnail}
              width={400}
              height={300}
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
