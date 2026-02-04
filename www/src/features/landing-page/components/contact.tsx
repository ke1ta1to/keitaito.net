import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Contact as ContactType } from "@/orval";
import { IconBrandX, IconMail } from "@tabler/icons-react";

export interface ContactProps {
  contact?: ContactType;
}

export function Contact(props: ContactProps) {
  const { contact = { email: "", x: "" } } = props;

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
            <a href={contact.x} target="_blank" rel="noopener noreferrer">
              {`@ ${contact.x.replaceAll("https://x.com/", "")}`}
            </a>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
