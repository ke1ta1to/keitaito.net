import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SkillsList } from "./skills-list";

const meta = {
  title: "landing-page/SkillsList",
  component: SkillsList,
} satisfies Meta<typeof SkillsList>;

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
      }
    ],
  },
};
