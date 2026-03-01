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
        title: "Next.js 16 の新機能まとめ",
        url: "https://zenn.dev/kk79it/articles/nextjs-16-features",
        liked_count: 42,
        published_at: "2025年3月1日",
        source: "zenn",
      },
      {
        title: "TypeScript 5.5 の新機能まとめ",
        url: "https://qiita.com/kk79it/items/1234567890abcdef",
        liked_count: 30,
        published_at: "2025年2月15日",
        source: "qiita",
      },
      {
        title: "React 18 の新機能まとめ",
        url: "https://zenn.dev/kk79it/articles/react-18-features",
        liked_count: 25,
        published_at: "2025年1月20日",
        source: "zenn",
      },
    ],
  },
};
