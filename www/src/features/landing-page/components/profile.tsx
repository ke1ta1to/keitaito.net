import githubIcon from "@/assets/github.svg";
import qiitaIcon from "@/assets/qiita.svg";
import xIcon from "@/assets/x.svg";
import zennIcon from "@/assets/zenn.svg";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Profile as ProfileType } from "@/orval";
import { differenceInYears } from "date-fns";
import Image from "next/image";

export interface ProfileProps {
  profile?: ProfileType;
}

const SOCIAL_LINKS = [
  { key: "x", label: "X", icon: xIcon },
  { key: "zenn", label: "Zenn", icon: zennIcon },
  { key: "qiita", label: "Qiita", icon: qiitaIcon },
] as const;

function formatAge(birthday: string): string {
  return `${differenceInYears(new Date(), new Date(birthday))}`;
}

export function Profile(props: ProfileProps) {
  const {
    profile = {
      name: "",
      birthday: "",
      location: "",
      school: "",
      image_url: "",
      x: "",
      github: "",
      zenn: "",
      qiita: "",
    },
  } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Avatar className="size-16">
          <AvatarImage alt={profile.name} src={profile.image_url} />
        </Avatar>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium">{profile.name}</div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-muted-foreground">
            <dt>age</dt>
            <dd>{formatAge(profile.birthday)}</dd>
            <dt>loc</dt>
            <dd>{profile.location}</dd>
            <dt>edu</dt>
            <dd>{profile.school}</dd>
          </dl>
        </div>
      </CardContent>
      <Separator />
      <CardContent>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
        >
          <Image alt="GitHub" src={githubIcon} className="size-5" />
          <span className="text-sm font-medium group-hover:underline">
            @{profile.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
          </span>
        </a>
      </CardContent>
      <Separator />
      <CardContent className="flex flex-wrap gap-4">
        {SOCIAL_LINKS.map(({ key, label, icon }) => {
          return (
            <a
              key={key}
              href={profile[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5"
            >
              <Image alt={label} src={icon} className="size-3.5" />
              <span>{label}</span>
            </a>
          );
        })}
      </CardContent>
    </Card>
  );
}
