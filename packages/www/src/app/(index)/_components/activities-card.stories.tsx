import type { Meta, StoryObj } from "@storybook/react";

import { ActivitiesCard } from "./activities-card";

const meta = {
  title: "Component/ActivitiesCard",
  component: ActivitiesCard,
} satisfies Meta<typeof ActivitiesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    maxActivities: 4,
    activities: [
      {
        date: "Aug. 2000",
        title: "生まれる",
        description: (
          <p>
            2000年8月に東京都八王子市で生まれる。
            <br />
            その後、東京都八王子市で育つ。
          </p>
        ),
      },
      {
        date: "Apr. 2007",
        title: "小学校入学",
        description: (
          <p>
            東京都八王子市立横山小学校に入学。
            <br />
            その後、東京都八王子市立横山小学校を卒業。
          </p>
        ),
      },
      {
        date: "Apr. 2013",
        title: "中学校入学",
        description: (
          <p>
            東京都八王子市立横山中学校に入学。
            <br />
            その後、東京都八王子市立横山中学校を卒業。
          </p>
        ),
      },
      {
        date: "Apr. 2016",
        title: "高校入学",
        description: (
          <p>
            東京都八千代松陰高等学校に入学。
            <br />
            その後、東京都八千代松陰高等学校を卒業。
          </p>
        ),
      },
      {
        date: "Apr. 2020",
        title: "大学入学",
        description: (
          <p>
            国立大学法人電気通信大学に入学。
            <br />
            その後、国立大学法人電気通信大学を卒業予定。
          </p>
        ),
      },
    ],
  },
};
