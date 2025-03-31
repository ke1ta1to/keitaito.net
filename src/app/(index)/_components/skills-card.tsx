import Image from "next/image";

import { OverviewCard } from "@/components/overview-card";

const skills = {
  special: [
    {
      label: "Amazon Web Services",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    },
    {
      label: "Cloudflare",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg",
    },
    {
      label: "Docker",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
    },
    {
      label: "Firebase",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
    },
    {
      label: "Supabase",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
    },
    {
      label: "React",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    },
    {
      label: "Vue.js",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg",
    },
    {
      label: "jQuery",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jquery/jquery-original.svg",
    },
  ],
  lang: [
    {
      label: "TypeScript",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
    },
    {
      label: "Node.js",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
    },
    {
      label: "Java",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
    },
    {
      label: "HTML",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
    },
    {
      label: "Ruby",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg",
    },
    {
      label: "C",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
    },
    {
      label: "C#",
      src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
    },
  ],
};

export function SkillsCard() {
  return (
    <OverviewCard title="Skills">
      <ul className="flex flex-wrap gap-4">
        {skills.special.map((skill) => (
          <li key={skill.label} className="rounded p-2 shadow-sm">
            <Image
              alt={skill.label}
              src={skill.src}
              width={128}
              height={128}
              className="h-auto w-12"
            />
          </li>
        ))}
      </ul>
      <ul className="mt-4 flex flex-wrap gap-4">
        {skills.lang.map((skill) => (
          <li key={skill.label} className="rounded p-2 shadow-sm">
            <Image
              alt={skill.label}
              src={skill.src}
              width={128}
              height={128}
              className="h-auto w-8"
            />
          </li>
        ))}
      </ul>
    </OverviewCard>
  );
}
