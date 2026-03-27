import Image from "next/image";

import githubIcon from "../_assets/github.svg";
import qiitaIcon from "../_assets/qiita.svg";
import twitterIcon from "../_assets/x.svg";
import zennIcon from "../_assets/zenn.svg";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface ProfileProps {
  profile: {
    name: string;
    age: string;
    location: string;
    school: string;
    image_url: string;
    social_links: {
      github: string;
      twitter: string;
      qiita: string;
      zenn: string;
    };
  };
}

export function Profile(props: ProfileProps) {
  const { profile } = props;
  const githubUsername = profile.social_links.github.replace(
    /^https?:\/\/(www\.)?github\.com\//,
    "",
  );

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
            @{githubUsername}
          </span>
        </a>
      </CardContent>
      <Separator />
      <CardContent className="flex flex-wrap gap-4">
        <a
          href={profile.social_links.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5"
        >
          <Image alt="X" src={twitterIcon} className="size-4" />
          <span>X</span>
        </a>
        <a
          href={profile.social_links.qiita}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5"
        >
          <Image alt="Qiita" src={qiitaIcon} className="size-4" />
          <span>Qiita</span>
        </a>
        <a
          href={profile.social_links.zenn}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5"
        >
          <Image alt="Zenn" src={zennIcon} className="size-4" />
          <span>Zenn</span>
        </a>
      </CardContent>
    </Card>
  );
}
