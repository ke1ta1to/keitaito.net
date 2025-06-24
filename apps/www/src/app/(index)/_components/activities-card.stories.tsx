import type { Meta, StoryObj } from "@storybook/nextjs";

import { ActivitiesCard } from "./activities-card";

import { activities } from "@/constants/data";

const meta = {
  title: "Components/ActivitiesCard",
  component: ActivitiesCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ActivitiesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activities: activities,
    maxActivities: 3,
  },
};

export const AllActivities: Story = {
  args: {
    activities: activities,
    maxActivities: activities.length,
  },
};

export const OneActivity: Story = {
  args: {
    activities: activities.slice(0, 1),
    maxActivities: 1,
  },
};

export const EmptyActivities: Story = {
  args: {
    activities: [],
    maxActivities: 3,
  },
};
