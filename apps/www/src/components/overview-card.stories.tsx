import type { Meta, StoryObj } from "@storybook/nextjs";

import { OverviewCard } from "./overview-card";

const meta = {
  title: "Components/OverviewCard",
  component: OverviewCard,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Sample Title",
  },
} satisfies Meta<typeof OverviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <p>
        これはOverviewCardのコンテンツです。任意のコンテンツを含めることができます。
      </p>
    ),
  },
};

export const WithList: Story = {
  args: {
    title: "リスト付き",
    children: (
      <ul>
        <li>アイテム 1</li>
        <li>アイテム 2</li>
        <li>アイテム 3</li>
      </ul>
    ),
  },
};

export const WithComplexContent: Story = {
  args: {
    title: "複雑なコンテンツ",
    children: (
      <div>
        <p>複数の要素を含むことができます。</p>
        <button className="bg-primary mt-2 rounded px-4 py-2 text-white">
          ボタン
        </button>
        <div className="mt-4 rounded bg-gray-100 p-4">
          <p>ネストされたコンテンツ</p>
        </div>
      </div>
    ),
  },
};

export const EmptyContent: Story = {
  args: {
    title: "空のコンテンツ",
    children: null,
  },
};

export const WithCustomClassName: Story = {
  args: {
    title: "カスタムスタイル",
    className: "bg-blue-50 border-2 border-blue-200",
    children: <p>カスタムクラスが適用されたカード</p>,
  },
};
