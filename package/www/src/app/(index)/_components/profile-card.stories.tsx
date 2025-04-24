import type { Meta, StoryObj } from "@storybook/react";

import { ProfileCard } from "./profile-card";

const meta = {
  title: "Component/ProfileCard",
  component: ProfileCard,
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    profile: {
      name: "John Doe",
      name_en: "John Doe",
      birthday: new Date("1990-01-01"),
      location: "New York, USA",
      school: "Harvard University",
      x: "https://x.com/johndoe",
      github: "https://github.com/johndoe",
      qiita: "https://qiita.com/johndoe",
      zenn: "https://zenn.dev/johndoe",
    },
  },
};
