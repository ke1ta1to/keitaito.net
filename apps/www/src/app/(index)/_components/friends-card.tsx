import { ArrowUpRight, Globe } from "lucide-react";
import Image from "next/image";

import { OverviewCard } from "@/components/overview-card";

export interface FriendSite {
  id: number;
  url: string;
  title: string;
  description: string | null;
  ogImage: string | null;
  author: string | null;
  favicon: string | null;
}

interface FriendsCardProps {
  friendSites: FriendSite[];
}

export function FriendsCard({ friendSites }: FriendsCardProps) {
  return (
    <OverviewCard title="相互リンク">
      {friendSites.length === 0 ? (
        <div className="py-8 text-center text-neutral-500">
          友達のサイトがありません
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {friendSites.map((site) => (
            <a
              key={site.id}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex overflow-hidden rounded border border-gray-100 bg-white shadow-sm sm:block"
            >
              <div className="relative aspect-square w-24 flex-shrink-0 overflow-hidden bg-gray-50 sm:aspect-video sm:w-auto">
                {site.ogImage ? (
                  <Image
                    src={site.ogImage}
                    alt={site.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Globe className="h-10 w-10 text-gray-300 sm:h-16 sm:w-16" />
                  </div>
                )}
                <div className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4 text-gray-700" />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-center p-3 sm:p-2">
                <h3 className="font-medium group-hover:underline">
                  {site.title}
                </h3>
                {site.description && (
                  <p className="mt-1 line-clamp-2 text-sm">
                    {site.description}
                  </p>
                )}
                {site.author && (
                  <p className="mt-1 text-xs text-neutral-500 sm:mt-2">
                    by {site.author}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </OverviewCard>
  );
}
