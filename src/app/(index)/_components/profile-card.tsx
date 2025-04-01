import {
  IconCake,
  IconMapPin2,
  IconSchool,
  IconSignature,
} from "@tabler/icons-react";
import Image from "next/image";

import { OverviewCard } from "@/components/overview-card";
import type { Profile } from "@/data/profile";
import { calcAge } from "@/utils/calc-age";

interface ProfileProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileProps) {
  const age = calcAge(profile.birthday, new Date());
  const birthdayStr = `'${profile.birthday.getFullYear().toString().slice(2)} (${age})`;

  return (
    <OverviewCard title="Profile">
      <div className="flex flex-col items-center justify-evenly gap-4 sm:flex-row">
        <Image
          alt=""
          src="/icon.webp"
          width={500}
          height={500}
          className="h-28 w-28 rounded-full"
        />
        <div className="self-start sm:self-center">
          <ul className="space-y-1">
            <li className="flex items-start gap-2">
              <IconSignature className="shrink-0" />
              {profile.name}
              <br />
              {profile.name_en}
            </li>
            <li className="flex items-start gap-2">
              <IconCake className="shrink-0" />
              {birthdayStr}
            </li>
            <li className="flex items-start gap-2">
              <IconMapPin2 className="shrink-0" />
              {profile.location}
            </li>
            <li className="flex items-start gap-2 whitespace-pre-wrap">
              <IconSchool className="shrink-0" />
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
