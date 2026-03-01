import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Overview } from "./overview";

const meta = {
  title: "Pages/Index/Overview",
  component: Overview,
} satisfies Meta<typeof Overview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
