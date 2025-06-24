import { Cake, GraduationCap, MapPin } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";

import type { profile } from "@/constants/data";

interface ProfileCardProps {
  profile: typeof profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-xl">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <Image
            src="/icon_sm.webp"
            alt="Profile picture"
            width={80}
            height={80}
            className="rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold whitespace-pre-line text-neutral-900">
              {profile.name}
            </h2>
          </div>
        </div>

        <div className="space-y-2 text-sm text-neutral-700">
          <div className="flex items-center gap-2">
            <Cake className="h-4 w-4 text-neutral-500" />
            <span>{profile.birthday}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-neutral-500" />
            <span>{profile.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-neutral-500" />
            <span className="whitespace-pre-line">{profile.school}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <NextLink
            href={profile.x}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/50 px-3 py-1.5 text-sm font-medium text-neutral-700 backdrop-blur-sm transition-all duration-150 hover:bg-white/70"
          >
            <Image
              src="/x.svg"
              alt="X logo"
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <span>X</span>
          </NextLink>

          <NextLink
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/50 px-3 py-1.5 text-sm font-medium text-neutral-700 backdrop-blur-sm transition-all duration-150 hover:bg-white/70"
          >
            <Image
              src="/github.svg"
              alt="GitHub logo"
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <span>GitHub</span>
          </NextLink>

          <NextLink
            href={profile.zenn}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/50 px-3 py-1.5 text-sm font-medium text-neutral-700 backdrop-blur-sm transition-all duration-150 hover:bg-white/70"
          >
            <Image
              src="/zenn.svg"
              alt="Zenn logo"
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <span>Zenn</span>
          </NextLink>

          <NextLink
            href={profile.qiita}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/50 px-3 py-1.5 text-sm font-medium text-neutral-700 backdrop-blur-sm transition-all duration-150 hover:bg-white/70"
          >
            <Image
              src="/qiita.svg"
              alt="Qiita logo"
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <span>Qiita</span>
          </NextLink>
        </div>
      </div>
    </div>
  );
}
