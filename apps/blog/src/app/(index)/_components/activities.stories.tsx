import type { Meta, StoryObj } from "@storybook/nextjs";

import { Activities } from "./activities";

const meta = {
  title: "Activities",
  component: Activities,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Activities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activities: [
      {
        id: "1",
        title: "Activity 1",
        date: "Jan 2024",
        description: "Description for activity 1",
      },
      {
        id: "2",
        title: "Activity 2",
        date: "Feb 2024",
        description: "Description for activity 2",
      },
      {
        id: "3",
        title: "Activity 3",
        date: "Mar 2024",
        description: "Description for activity 3",
      },
    ],
  },
};
