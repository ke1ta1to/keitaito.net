import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticlesList } from "./articles-list";

const meta = {
  title: "landing-page/ArticlesList",
  component: ArticlesList,
} satisfies Meta<typeof ArticlesList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    articles: [
      {
        title: "Next.js 16 の新機能まとめ",
        url: "https://zenn.dev/kk79it/articles/nextjs-16-features",
        liked_count: 42,
        published_at: "2025-12-19T15:52:38.939+09:00",
        source: "zenn",
      },
      {
        title: "AWS CDK で EventBridge スケジュールを設定する",
        url: "https://qiita.com/ke1ta1to/items/aws-cdk-eventbridge",
        liked_count: 18,
        published_at: "2025-11-05T10:30:00.000+09:00",
        source: "qiita",
      },
      {
        title: "Go の DynamoDB SDK v2 入門",
        url: "https://zenn.dev/kk79it/articles/go-dynamodb-sdk-v2",
        liked_count: 35,
        published_at: "2025-10-15T09:00:00.000+09:00",
        source: "zenn",
      },
      {
        title: "Tailwind CSS v4 マイグレーションガイド",
        url: "https://qiita.com/ke1ta1to/items/tailwind-v4-migration",
        liked_count: 27,
        published_at: "2025-09-20T14:00:00.000+09:00",
        source: "qiita",
      },
      {
        title: "React 19 の新しい Hooks を試してみた",
        url: "https://zenn.dev/kk79it/articles/react-19-hooks",
        liked_count: 56,
        published_at: "2025-08-10T12:00:00.000+09:00",
        source: "zenn",
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    articles: [],
  },
};

export const WithoutSource: Story = {
  args: {
    articles: [
      {
        title: "ソースなしの記事",
        url: "https://example.com/article",
        liked_count: 10,
        published_at: "2025-12-01T00:00:00.000+09:00",
        source: null,
      },
    ],
  },
};
