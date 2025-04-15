import type { ProfilePage, WithContext } from "schema-dts";

import { getEnv } from "@/lib/env-vars";

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "伊藤啓太",
      alternateName: "Keita Ito",
      image: [new URL("/icon_full.webp", getEnv().customUrl).toString()],
    },
    dateCreated: new Date("2024-01-01").toISOString(),
    dateModified: new Date().toISOString(),
  } satisfies WithContext<ProfilePage>;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
