import type { Meta, StoryObj } from "@storybook/react";

import { ArticlesCard } from "./articles-card";

const meta = {
  title: "Component/ArticlesCard",
  component: ArticlesCard,
} satisfies Meta<typeof ArticlesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    maxArticles: 4,
    articles: [
      {
        title: "Sample Article Title",
        url: "https://example.com",
        published_at: "Mar 1. 2023",
        liked_count: 10,
      },
      {
        title: "Another Sample Article Title",
        url: "https://example.com",
        published_at: "Mar 2. 2023",
        liked_count: 20,
        source: "qiita",
      },
      {
        title: "Yet Another Sample Article Title",
        url: "https://example.com",
        published_at: "Mar 3. 2023",
        liked_count: 30,
        source: "zenn",
      },
      {
        title: "Last Sample Article Title",
        url: "https://example.com",
        published_at: "Mar 4. 2023",
        liked_count: 40,
        source: "zenn",
      },
    ],
  },
};
