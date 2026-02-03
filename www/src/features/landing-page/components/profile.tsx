import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Profile as ProfileType } from "@/orval";

export interface ProfileProps {
  profile?: ProfileType;
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
      <CardHeader>Profile</CardHeader>
      <CardContent>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </CardContent>
    </Card>
  );
}
