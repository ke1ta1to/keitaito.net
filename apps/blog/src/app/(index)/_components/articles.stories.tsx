import type { Meta, StoryObj } from "@storybook/nextjs";

import { Articles } from "./articles";

const meta = {
  title: "Articles",
  component: Articles,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Articles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    articles: [
      {
        title: "Article 1",
        url: "https://example.com/article1",
        liked_count: 10,
        published_at: "2024/01/01",
        source: "qiita",
      },
      {
        title: "Article 2",
        url: "https://example.com/article2",
        liked_count: 20,
        published_at: "2024/02/01",
        source: "zenn",
      },
      {
        title: "Article 3",
        url: "https://example.com/article3",
        liked_count: 5,
        published_at: "2024/03/01",
        source: null,
      },
    ],
  },
};
