import type { Meta, StoryObj } from "@storybook/react";

import { SkillsCard } from "./skills-card";

const meta = {
  title: "Component/SkillsCard",
  component: SkillsCard,
} satisfies Meta<typeof SkillsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    skills: {
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
      ],
      lang: [
        {
          label: "TypeScript",
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
        },
        {
          label: "Python",
          src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
        },
      ],
    },
  },
};
