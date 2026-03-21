import type { Meta, StoryObj } from "@storybook/nextjs";

import { WorkCard, Works, WorksSkeleton } from "./works";

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

const sampleWorks = [
  { title: "Work 1", thumbnailUrl: "https://picsum.photos/600/400?random=1" },
  { title: "Work 2", thumbnailUrl: null },
  { title: "Work 3", thumbnailUrl: "https://picsum.photos/600/400?random=3" },
];

export const Default: Story = {
  args: {
    children: sampleWorks.map((work, i) => (
      <WorkCard key={i} title={work.title} thumbnailUrl={work.thumbnailUrl} />
    )),
  },
};
