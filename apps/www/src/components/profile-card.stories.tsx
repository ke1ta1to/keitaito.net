import type { Meta, StoryObj } from "@storybook/nextjs";

import { ProfileCard } from "./profile-card";

import { profile } from "@/constants/data";

const meta = {
  title: "Components/ProfileCard",
  component: ProfileCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    profile: {
      description: "プロフィール情報を含むオブジェクト",
    },
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    profile: profile,
  },
};

export const CustomProfile: Story = {
  args: {
    profile: {
      name: "山田太郎\nTaro Yamada",
      birthday: "Jan. 2000",
      location: "Osaka, Japan",
      school: "大阪大学\n工学部 情報科学科",
      x: "https://x.com/example",
      github: "https://github.com/example",
      zenn: "https://zenn.dev/example",
      qiita: "https://qiita.com/example",
    },
  },
};

export const MinimalProfile: Story = {
  args: {
    profile: {
      name: "田中花子",
      birthday: "Dec. 1999",
      location: "Kyoto, Japan",
      school: "京都大学",
      x: "https://x.com/example2",
      github: "https://github.com/example2",
      zenn: "https://zenn.dev/example2",
      qiita: "https://qiita.com/example2",
    },
  },
};
