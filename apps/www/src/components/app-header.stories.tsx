import type { Meta, StoryObj } from "@storybook/nextjs";

import { AppHeader } from "./app-header";

const meta = {
  title: "Components/AppHeader",
  component: AppHeader,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
