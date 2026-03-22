import { CircleUser, Mail } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface ContactProps {
  contact: {
    email: string;
    twitter: string;
  };
}

export function Contact(props: ContactProps) {
  const { contact } = props;

  return (
    <Card>
      <CardHeader>Contact</CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-center gap-2">
            <Mail />
            <span>{contact.email.replaceAll("@", " (at) ")}</span>
          </li>
          <li className="flex items-center gap-2">
            <CircleUser />
            <a href={contact.twitter} target="_blank" rel="noopener noreferrer">
              {`@ ${contact.twitter.replaceAll("https://x.com/", "")}`}
            </a>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
