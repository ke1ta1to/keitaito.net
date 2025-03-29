import type { Meta, StoryObj } from "@storybook/react";

import { AppHeader } from "./app-header";

const meta = {
  title: "UI/AppHeader",
  component: AppHeader,
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
