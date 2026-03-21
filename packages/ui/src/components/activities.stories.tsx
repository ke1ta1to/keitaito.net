import type { Meta, StoryObj } from "@storybook/nextjs";

import { Activities, ActivitiesSkeleton } from "./activities";

const meta = {
  title: "Activities",
  component: Activities,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Activities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: StoryObj = {
  render: () => <ActivitiesSkeleton />,
};

export const Default: Story = {
  args: {
    activities: [
      {
        id: "1",
        title: "Created a new project",
        description: "You created a new project called 'Project Alpha'.",
        date: "Jan 2026",
      },
      {
        id: "2",
        title: "Updated project settings",
        description: "You updated the settings for 'Project Alpha'.",
        date: "Feb 2026",
      },
      {
        id: "3",
        title: "Added a new member",
        description: "You added John Doe to 'Project Alpha'.",
        date: "Mar 2026",
      },
    ],
  },
};
