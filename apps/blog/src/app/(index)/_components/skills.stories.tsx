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
        name: "JavaScript",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
      },
      {
        name: "TypeScript",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
      },
      {
        name: "React",
        icon_url:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
      },
    ],
  },
};
