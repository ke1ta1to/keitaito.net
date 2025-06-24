import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProfileCard } from "./profile-card";

import { profile } from "@/constants/data";

const meta = {
  title: "Components/ProfileCard",
  component: ProfileCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    profile: {
      description: "プロフィール情報を含むオブジェクト",
    },
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    profile: profile,
  },
};

export const Fullscreen: Story = {
  args: {
    profile: profile,
  },
  parameters: {
    layout: "fullscreen",
  },
};
