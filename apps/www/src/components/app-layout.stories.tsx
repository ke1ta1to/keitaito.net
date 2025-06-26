import type { Meta, StoryObj } from "@storybook/nextjs";

import AppLayout from "./app-layout";

const meta = {
  title: "Components/AppLayout",
  component: AppLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: false,
      description: "レイアウト内に表示される子要素",
    },
    bgColor: {
      control: { type: "radio" },
      options: ["white", "gradient"],
      description: "背景色のタイプ",
    },
  },
} satisfies Meta<typeof AppLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleContent = () => (
  <div className="p-8">
    <h1 className="mb-4 text-4xl font-bold">サンプルページ</h1>
    <p className="mb-4">
      これはAppLayoutコンポーネントのデモンストレーション用のサンプルコンテンツです。
    </p>
    <p>
      AppLayoutはヘッダー、フッター、そしてメインコンテンツエリアで構成されています。
    </p>
  </div>
);

export const Default: Story = {
  args: {
    children: <SampleContent />,
    bgColor: "white",
  },
};

export const WithGradient: Story = {
  args: {
    children: <SampleContent />,
    bgColor: "gradient",
  },
};

export const WithLongContent: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="mb-4 text-4xl font-bold">長いコンテンツのページ</h1>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i} className="mb-4">
            これはパラグラフ {i + 1} です。
            スクロール時のレイアウト動作を確認するために、複数のパラグラフを表示しています。
            各パラグラフには十分なテキストが含まれており、ページ全体が垂直方向にスクロール可能になっています。
          </p>
        ))}
      </div>
    ),
    bgColor: "white",
  },
};

export const EmptyContent: Story = {
  args: {
    children: <div />,
    bgColor: "white",
  },
};