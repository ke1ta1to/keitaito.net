import type { Meta, StoryObj } from "@storybook/nextjs";

import { SubmissionSuccess } from "./submission-success";

const meta = {
  title: "Add Friend Request/SubmissionSuccess",
  component: SubmissionSuccess,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "相互リンク申請完了画面コンポーネント。申請送信後に表示される成功メッセージと次のアクションを提供します。",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SubmissionSuccess>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "デフォルトの申請完了画面。成功メッセージ、今後の流れの説明、アクションボタンが表示されます。",
      },
    },
  },
};

export const Fullscreen: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "フルスクリーンでの表示。実際のページレイアウトでの見た目を確認できます。",
      },
    },
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "モバイル表示での見た目。レスポンシブデザインが適用され、ボタンが縦並びになります。",
      },
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story:
          "タブレット表示での見た目。中間サイズでのレイアウトを確認できます。",
      },
    },
  },
};

export const WithoutPadding: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "パディング付きレイアウトでの表示。コンテナ内での配置を確認できます。",
      },
    },
  },
};
