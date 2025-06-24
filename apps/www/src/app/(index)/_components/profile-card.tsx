import { Cake, Map, School, Signature } from "lucide-react";
import Image from "next/image";

import { OverviewCard } from "@/components/overview-card";
import type { profile } from "@/constants/data";
import { calcAge } from "@/utils/calc-age";

interface ProfileCardProps {
  profile: typeof profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const age = calcAge(profile.birthday, new Date());
  const birthdayStr = `'${profile.birthday.getFullYear().toString().slice(2)} (${age})`;

  return (
    <OverviewCard title="Profile">
      <div className="flex flex-col items-center justify-evenly gap-8 sm:flex-row">
        <Image
          alt=""
          src="/icon_sm.webp"
          width={500}
          height={500}
          className="h-32 w-32 rounded-full"
        />
        <div className="self-start sm:self-center">
          <ul className="space-y-1 whitespace-pre-wrap">
            <li className="flex items-start gap-2">
              <Signature className="shrink-0" />
              {profile.name}
            </li>
            <li className="flex items-start gap-2">
              <Cake className="shrink-0" />
              {birthdayStr}
            </li>
            <li className="flex items-start gap-2">
              <Map className="shrink-0" />
              {profile.location}
            </li>
            <li className="flex items-start gap-2">
              <School className="shrink-0" />
              {profile.school}
            </li>
          </ul>
        </div>
      </div>
      <ul className="mt-2 flex flex-wrap justify-center gap-2">
        <li>
          <a
            href={profile.x}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-1"
          >
            <Image
              alt=""
              src="/x.svg"
              width={128}
              height={128}
              className="h-auto w-6"
            />
          </a>
        </li>
        <li>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-1"
          >
            <Image
              alt=""
              src="/github.svg"
              width={150}
              height={150}
              className="h-auto w-6"
            />
          </a>
        </li>
        <li>
          <a
            href={profile.zenn}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-1"
          >
            <Image
              alt=""
              src="/zenn.svg"
              width={88.3}
              height={88.3}
              className="h-auto w-6"
            />
          </a>
        </li>
        <li>
          <a
            href={profile.qiita}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-1"
          >
            <Image
              alt=""
              src="/qiita.svg"
              width={400}
              height={400}
              className="h-auto w-6"
            />
          </a>
        </li>
      </ul>
    </OverviewCard>
  );
}
