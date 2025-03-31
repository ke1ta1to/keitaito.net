import {
  IconCake,
  IconMapPin2,
  IconSchool,
  IconSignature,
} from "@tabler/icons-react";
import Image from "next/image";

import { OverviewCard } from "@/components/overview-card";
import { calcAge } from "@/utils/calc-age";

const { title, name, name_en, birthday, location, school } = {
  title: "Profile",
  name: "伊藤啓太",
  name_en: "Keita Ito",
  birthday: new Date("2004-07-09"),
  location: "Tokyo, Japan",
  school: "電気通信大学\n情報理工学域 I類\nメディア情報学プログラム",
};

export function ProfileCard() {
  const age = calcAge(birthday, new Date());
  const birthdayStr = `'${birthday.getFullYear().toString().slice(2)} (${age})`;

  return (
    <OverviewCard title={title}>
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
              {name}
              <br />
              {name_en}
            </li>
            <li className="flex items-start gap-2">
              <IconCake className="shrink-0" />
              {birthdayStr}
            </li>
            <li className="flex items-start gap-2">
              <IconMapPin2 className="shrink-0" />
              {location}
            </li>
            <li className="flex items-start gap-2 whitespace-pre-wrap">
              <IconSchool className="shrink-0" />
              {school}
            </li>
          </ul>
        </div>
      </div>
      <ul className="mt-1 flex flex-wrap justify-center gap-2">
        <li>
          <a
            href="https://x.com/ke1ta1to"
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
            href="https://zenn.dev/kk79it"
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
            href="https://qiita.com/ke1ta1to"
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
