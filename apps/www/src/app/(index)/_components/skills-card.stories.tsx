import type { Meta, StoryObj } from "@storybook/nextjs";

import { SkillsCard } from "./skills-card";

import { skills } from "@/constants/data";

const meta = {
  title: "Components/SkillsCard",
  component: SkillsCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    skills: {
      description: "スキル情報を含むオブジェクト",
    },
  },
} satisfies Meta<typeof SkillsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    skills: skills,
  },
};

export const Fullscreen: Story = {
  args: {
    skills: skills,
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const LimitedSkills: Story = {
  args: {
    skills: {
      special: skills.special.slice(0, 3),
      lang: skills.lang.slice(0, 3),
    },
  },
};
