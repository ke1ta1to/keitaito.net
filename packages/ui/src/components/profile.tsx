import Image from "next/image";

import { Avatar, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

import githubIcon from "@repo/ui/assets/github.svg";
import qiitaIcon from "@repo/ui/assets/qiita.svg";
import twitterIcon from "@repo/ui/assets/x.svg";
import zennIcon from "@repo/ui/assets/zenn.svg";

export interface ProfileProps {
  profile?: {
    name: string;
    age: string;
    location: string;
    school: string;
    image_url: string;
    social_links: {
      twitter: string;
      github: string;
      zenn: string;
      qiita: string;
    };
  };
}

const SOCIAL_LINKS = [
  { key: "twitter", label: "X", icon: twitterIcon },
  { key: "zenn", label: "Zenn", icon: zennIcon },
  { key: "qiita", label: "Qiita", icon: qiitaIcon },
] as const;

export function Profile(props: ProfileProps) {
  const { profile } = props;

  if (!profile) {
    return null;
  }

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
          <dl className="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <dt>age</dt>
            <dd>{profile.age}</dd>
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
          href={profile.social_links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3"
        >
          <Image alt="GitHub" src={githubIcon} className="size-5" />
          <span className="text-sm font-medium group-hover:underline">
            @
            {profile.social_links.github.replace(
              /^https?:\/\/(www\.)?github\.com\//,
              "",
            )}
          </span>
        </a>
      </CardContent>
      <Separator />
      <CardContent className="flex flex-wrap gap-4">
        {SOCIAL_LINKS.map(({ key, label, icon }) => {
          return (
            <a
              key={key}
              href={profile.social_links[key]}
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
