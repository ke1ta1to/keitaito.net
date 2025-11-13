import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Activities } from "./activities";

const meta = {
  title: "Pages/Index/Activities",
  component: Activities,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Activities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activities: [
      {
        date: "Mar. 2023",
        title: "New Year's Day Celebration",
        description:
          "Join us for a festive celebration to welcome the new year with music, food, and fireworks.",
      },
      {
        date: "Feb. 2023",
        title: "Valentine's Day Special",
        description:
          "Celebrate love and friendship with special events and offers for couples and friends.",
      },
    ],
  },
};
