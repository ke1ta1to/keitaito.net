import { IconBrandX, IconMail } from "@tabler/icons-react";

import { OverviewCard } from "@/components/overview-card";

export function ContactCard() {
  return (
    <OverviewCard title="Contact">
      <div className="prose max-w-none">
        <p>
          <IconMail className="mr-2 inline-block" />
          keitaito(at)keitaito.net
          <br />
          <small>(at)を@に置き換えてください</small>
        </p>
        <p>
          <IconBrandX className="mr-2 inline-block" />
          <a
            href="https://x.com/ke1ta1to"
            target="_blank"
            rel="noopener noreferrer"
          >
            @ke1ta1to
          </a>
          <br />
          <small>DMにてご連絡ください</small>
        </p>
      </div>
    </OverviewCard>
  );
}
