import type { Meta, StoryObj } from "@storybook/nextjs";

import { AppHeader } from "./app-header";

const meta = {
  component: AppHeader,
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
