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
        <ul className="flex flex-col gap-1 self-start sm:self-center">
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
    </OverviewCard>
  );
}
