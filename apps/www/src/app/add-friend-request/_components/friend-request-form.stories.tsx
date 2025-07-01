import type { Meta, StoryObj } from "@storybook/nextjs";

import { FriendRequestForm } from "./friend-request-form";

interface FriendRequestFormData {
  url: string;
  title: string;
  description?: string;
  author?: string;
  email: string;
  submittedNote?: string;
}

type ActionResult =
  | { success: true }
  | { success: false; error: string; field?: string };

// Mock action function for Storybook
const mockAction = async (
  data: FriendRequestFormData,
): Promise<ActionResult> => {
  console.log("Form submitted:", data);
  // Simulate successful submission
  return { success: true };
};

const meta = {
  title: "Add Friend Request/FriendRequestForm",
  component: FriendRequestForm,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "相互リンク申請フォームコンポーネント。サイト情報を入力して申請を送信できます。",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    action: {
      description: "フォーム送信時に実行されるServer Action",
    },
  },
} satisfies Meta<typeof FriendRequestForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    action: mockAction,
  },
  parameters: {
    docs: {
      description: {
        story:
          "デフォルトの友達リンク申請フォーム。全ての入力項目とバリデーションが含まれています。",
      },
    },
  },
};

export const Fullscreen: Story = {
  args: {
    action: mockAction,
  },
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
  args: {
    action: mockAction,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "モバイル表示での見た目。レスポンシブデザインが適用されています。",
      },
    },
  },
};
