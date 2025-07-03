import type { Meta, StoryObj } from "@storybook/nextjs";

import type { FriendSite } from "./friends-card";
import { FriendsCard } from "./friends-card";

const mockFriendSites: FriendSite[] = [
  {
    id: 1,
    url: "https://example-blog.com",
    title: "Tech Blog by Tanaka",
    description:
      "技術ブログを書いています。主にWebフロントエンドの話題を扱っています。",
    ogImage:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop",
    author: "田中太郎",
  },
  {
    id: 2,
    url: "https://portfolio.yamada.dev",
    title: "Yamada's Portfolio",
    description: "フリーランスエンジニアのポートフォリオサイト",
    ogImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop",
    author: "山田花子",
  },
  {
    id: 3,
    url: "https://design-works.jp",
    title: "デザインワークス",
    description: "UIデザイナーの作品集",
    ogImage: null,
    author: "佐藤次郎",
  },
  {
    id: 4,
    url: "https://photo-gallery.net",
    title: "Photo Gallery",
    description: "風景写真を中心としたフォトギャラリー",
    ogImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    author: "鈴木一郎",
  },
  {
    id: 5,
    url: "https://music-blog.example.com",
    title: "音楽ブログ",
    description: null,
    ogImage: null,
    author: "高橋みなみ",
  },
];

const meta = {
  title: "Components/FriendsCard",
  component: FriendsCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    friendSites: {
      description: "友達のサイト情報の配列",
    },
  },
} satisfies Meta<typeof FriendsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    friendSites: mockFriendSites,
  },
};

export const SingleSite: Story = {
  args: {
    friendSites: [mockFriendSites[0]],
  },
};

export const WithoutImages: Story = {
  args: {
    friendSites: [
      {
        id: 1,
        url: "https://example.com",
        title: "サンプルサイト",
        description: "画像なしのサイト",
        ogImage: null,
        author: "作者名",
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    friendSites: [],
  },
};

export const Fullscreen: Story = {
  args: {
    friendSites: mockFriendSites,
  },
  parameters: {
    layout: "fullscreen",
  },
};
