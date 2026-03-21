import type { Meta, StoryObj } from "@storybook/nextjs";

import { Header } from "./header";

const meta = {
  title: "Layouts/Header",
  component: Header,
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
