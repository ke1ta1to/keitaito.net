import type { Meta, StoryObj } from "@storybook/react";

import { ProfileCard } from "./profile-card";

const meta = {
  title: "UI/ProfileCard",
  component: ProfileCard,
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
