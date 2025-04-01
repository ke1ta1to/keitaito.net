import type { Meta, StoryObj } from "@storybook/react";

import { WorksCard } from "./works-card";

const meta = {
  title: "Component/WorksCard",
  component: WorksCard,
} satisfies Meta<typeof WorksCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    works: [
      {
        title: "My First Work",
        thumbnail: "https://picsum.photos/800/600",
        description:
          "This is my first work. It is a simple project that does nothing.",
        url: "https://example.com",
      },
      {
        title: "My Second Work",
        thumbnail: "https://picsum.photos/800/600",
        description:
          "This is my second work. It is a simple project that does nothing.",
        url: "https://example.com",
      },
      {
        title: "My Third Work",
        thumbnail: "https://picsum.photos/800/600",
        description:
          "This is my third work. It is a simple project that does nothing.",
        url: "https://example.com",
      },
    ],
  },
};
