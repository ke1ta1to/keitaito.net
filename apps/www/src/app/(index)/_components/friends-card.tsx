"use client";

import { ArrowUpRight, Globe, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { OverviewCard } from "@/components/overview-card";

export interface FriendSite {
  id: number;
  url: string;
  title: string;
  description: string | null;
  ogImage: string | null;
  author: string | null;
}

interface FriendsCardProps {
  friendSites: FriendSite[];
}

function FriendSiteCard({ site }: { site: FriendSite }) {
  const [imageError, setImageError] = useState(false);

  // Supabase Storageの画像パスに/assets/プレフィックスを追加
  const getImageSrc = (ogImage: string | null) => {
    if (!ogImage) return null;
    return `/assets/${ogImage}`;
  };

  const imageSrc = getImageSrc(site.ogImage);

  return (
    <a
      key={site.id}
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex overflow-hidden rounded border border-gray-100 bg-white shadow-sm sm:block"
    >
      <div className="relative aspect-square w-24 flex-shrink-0 overflow-hidden bg-gray-50 sm:aspect-video sm:w-auto">
        {imageSrc && !imageError ? (
          <Image
            src={imageSrc}
            alt={site.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
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
        <h3 className="font-medium group-hover:underline">{site.title}</h3>
        {site.description && (
          <p className="mt-1 line-clamp-2 text-sm">{site.description}</p>
        )}
        {site.author && (
          <p className="mt-1 text-xs text-neutral-500 sm:mt-2">
            by {site.author}
          </p>
        )}
      </div>
    </a>
  );
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
            <FriendSiteCard key={site.id} site={site} />
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-center">
        <Link
          href="/add-friend-request"
          className="border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          相互リンクを申請する
        </Link>
      </div>
    </OverviewCard>
  );
}
