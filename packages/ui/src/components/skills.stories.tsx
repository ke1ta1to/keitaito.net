import type { Meta, StoryObj } from "@storybook/nextjs";

import { Skills } from "./skills";

const meta = {
  title: "Skills",
  component: Skills,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Skills>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    skills: [
      {
        id: "1",
        name: "JavaScript",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      },
      {
        id: "2",
        name: "TypeScript",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        id: "3",
        name: "React",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      },
      {
        id: "4",
        name: "Next.js",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      },
      {
        id: "5",
        name: "Node.js",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
      },
    ],
  },
};
