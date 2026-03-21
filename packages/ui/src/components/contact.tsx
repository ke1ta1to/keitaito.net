import { IconBrandX, IconMail } from "@tabler/icons-react";

import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export interface ContactProps {
  contact?: {
    email: string;
    twitter: string;
  };
}

export function Contact(props: ContactProps) {
  const { contact } = props;

  if (!contact) {
    return null;
  }

  return (
    <Card>
      <CardHeader>Contact</CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-center gap-2">
            <IconMail />
            <span>{contact.email.replaceAll("@", " (at) ")}</span>
          </li>
          <li className="flex items-center gap-2">
            <IconBrandX />
            <a href={contact.twitter} target="_blank" rel="noopener noreferrer">
              {`@ ${contact.twitter.replaceAll("https://x.com/", "")}`}
            </a>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export function ContactSkeleton() {
  return (
    <Card>
      <CardHeader>Contact</CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-center gap-2">
            <Skeleton className="size-6" />
            <Skeleton className="h-4 w-40" />
          </li>
          <li className="flex items-center gap-2">
            <Skeleton className="size-6" />
            <Skeleton className="h-4 w-32" />
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
