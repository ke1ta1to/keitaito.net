import type { Meta, StoryObj } from "@storybook/nextjs";

import { ArticlesCard } from "./articles-card";

import type { Article } from "@/lib/articles-fetcher";

const mockArticles: Article[] = [
  {
    title: "React 19の新機能について",
    url: "https://zenn.dev/example/articles/react19-features",
    liked_count: 42,
    published_at: "2024-01-15",
    source: "zenn",
  },
  {
    title: "TypeScriptで型安全なAPIクライアントを作る",
    url: "https://qiita.com/example/items/typescript-api-client",
    liked_count: 28,
    published_at: "2024-01-10",
    source: "qiita",
  },
  {
    title: "Next.js App Routerの実践的な使い方",
    url: "https://example.com/nextjs-app-router",
    liked_count: 15,
    published_at: "2024-01-05",
  },
  {
    title: "Tailwind CSS v4の新機能",
    url: "https://zenn.dev/example/articles/tailwindcss-v4",
    liked_count: 35,
    published_at: "2023-12-20",
    source: "zenn",
  },
  {
    title: "JavaScriptのベストプラクティス",
    url: "https://qiita.com/example/items/modern-javascript-best-practices",
    liked_count: 52,
    published_at: "2023-12-15",
    source: "qiita",
  },
];

const meta = {
  title: "Components/ArticlesCard",
  component: ArticlesCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    articles: {
      description: "表示する記事の配列",
    },
    maxArticles: {
      description: "表示する記事の最大数",
      control: { type: "number", min: 1, max: 10 },
    },
  },
} satisfies Meta<typeof ArticlesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    articles: mockArticles,
    maxArticles: 5,
  },
};

export const LimitedArticles: Story = {
  args: {
    articles: mockArticles,
    maxArticles: 2,
  },
};

export const EmptyArticles: Story = {
  args: {
    articles: [],
    maxArticles: 5,
  },
};

export const SingleArticle: Story = {
  args: {
    articles: [mockArticles[0]],
    maxArticles: 5,
  },
};

export const Fullscreen: Story = {
  args: {
    articles: mockArticles,
    maxArticles: 5,
  },
  parameters: {
    layout: "fullscreen",
  },
};
