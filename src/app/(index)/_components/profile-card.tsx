import {
  IconCake,
  IconMapPin2,
  IconSchool,
  IconSignature,
} from "@tabler/icons-react";
import Image from "next/image";

import { OverviewCard } from "@/components/overview-card";

export function ProfileCard() {
  return (
    <OverviewCard title="Overview">
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
            伊藤啓太
            <br />
            Keita ito
          </li>
          <li className="flex items-start gap-2">
            <IconCake className="shrink-0" />
            &apos;04 (20)
          </li>
          <li className="flex items-start gap-2">
            <IconMapPin2 className="shrink-0" />
            Tokyo, Japan
          </li>
          <li className="flex items-start gap-2">
            <IconSchool className="shrink-0" />
            電気通信大学
            <br />
            情報理工学域 I類
            <br />
            メディア情報学プログラム
          </li>
        </ul>
      </div>
    </OverviewCard>
  );
}
