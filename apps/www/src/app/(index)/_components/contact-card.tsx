import { Mail, X } from "lucide-react";

import { OverviewCard } from "@/components/overview-card";
import type { Contact } from "@/constants/data";

interface ContactCardProps {
  contact: Contact;
}

export function ContactCard({ contact }: ContactCardProps) {
  return (
    <OverviewCard title="Contact">
      <div className="prose max-w-none">
        <p>
          <Mail className="mr-2 inline-block" />
          {contact.email}
          <br />
          <small>{contact.emailNote}</small>
        </p>
        <p>
          <X className="mr-2 inline-block" />
          <a href={contact.xUrl} target="_blank" rel="noopener noreferrer">
            @{contact.xUsername}
          </a>
          <br />
          <small>{contact.xNote}</small>
        </p>
      </div>
    </OverviewCard>
  );
}
