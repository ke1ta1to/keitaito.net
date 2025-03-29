import type { Meta, StoryObj } from "@storybook/react";

import { OverviewCard } from "./overview-card";

const meta = {
  title: "UI/OverviewCard",
  component: OverviewCard,
} satisfies Meta<typeof OverviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: "タイトル",
    children: <div>コンテンツ</div>,
  },
};
