import type { Meta, StoryObj } from "@storybook/nextjs";

import { AppFooter } from "./app-footer";

const meta = {
  title: "Components/AppFooter",
  component: AppFooter,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AppFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};