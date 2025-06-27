import type { Meta, StoryObj } from "@storybook/nextjs";

import { WorksCard } from "./works-card";

import type { WorkMetadata } from "@/lib/works";

const mockWorks: WorkMetadata[] = [
  {
    title: "第74回調布祭ウェブサイト",
    description: "2024年11月に開催された電通大の学園祭「調布祭」のウェブサイト",
    keywords: ["調布祭", "学園祭", "電気通信大学", "ウェブサイト", "Nuxt.js"],
    slug: "chofusai",
    url: "/works/chofusai",
    thumbnail: {
      alt: "第74回調布祭ウェブサイトのサムネイル",
      src: {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=900&fit=crop&crop=entropy&cs=tinysrgb",
        height: 900,
        width: 1600,
        blurDataURL: "",
      },
      width: 1600,
      height: 900,
    },
  },
  {
    title: "Mo - Markdownエディター",
    description: "シンプルで使いやすいMarkdownエディター",
    keywords: ["Markdown", "エディター", "React", "TypeScript"],
    slug: "mo",
    url: "/works/mo",
    thumbnail: {
      alt: "Mo - Markdownエディターのサムネイル",
      src: {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop&crop=entropy&cs=tinysrgb",
        height: 900,
        width: 1600,
        blurDataURL: "",
      },
      width: 1600,
      height: 900,
    },
  },
  {
    title: "ポートフォリオサイト",
    description: "個人のポートフォリオウェブサイト",
    keywords: ["ポートフォリオ", "Next.js", "TypeScript", "Tailwind CSS"],
    slug: "portfolio",
    url: "/works/portfolio",
    thumbnail: {
      alt: "ポートフォリオサイトのサムネイル",
      src: {
        src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1600&h=900&fit=crop&crop=entropy&cs=tinysrgb",
        height: 900,
        width: 1600,
        blurDataURL: "",
      },
      width: 1600,
      height: 900,
    },
  },
];

const meta = {
  title: "Components/WorksCard",
  component: WorksCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    works: {
      description: "作品情報の配列",
    },
  },
} satisfies Meta<typeof WorksCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    works: mockWorks,
  },
};

export const SingleWork: Story = {
  args: {
    works: [mockWorks[0]],
  },
};

export const Empty: Story = {
  args: {
    works: [],
  },
};

export const Fullscreen: Story = {
  args: {
    works: mockWorks,
  },
  parameters: {
    layout: "fullscreen",
  },
};
