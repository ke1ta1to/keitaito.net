import type { Meta, StoryObj } from "@storybook/nextjs";

import { Works, WorksSkeleton } from "./works";

const meta = {
  title: "Works",
  component: Works,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Works>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: StoryObj = {
  render: () => <WorksSkeleton />,
};

export const Default: Story = {
  args: {
    works: [
      {
        id: "1",
        title: "Work 1",
        slug: "work-1",
        content: "This is the first work.",
        thumbnail_url: "https://picsum.photos/600/400?random=1",
      },
      {
        id: "2",
        title: "Work 2",
        slug: "work-2",
        content: "This is the second work.",
        thumbnail_url: null,
      },
      {
        id: "3",
        title: "Work 3",
        slug: "work-3",
        content: "This is the third work.",
        thumbnail_url: "https://picsum.photos/600/400?random=3",
      },
    ],
  },
};
