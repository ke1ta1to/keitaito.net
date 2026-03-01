import type { Meta, StoryObj } from "@storybook/nextjs";

import { Profile } from "./profile";

const meta = {
  title: "Components/Profile",
  component: Profile,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Profile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    profile: {
      name: "John Doe",
      age: "30",
      location: "New York",
      school: "University of Chicago",
      image_url: "https://randomuser.me/api/portraits/men/1.jpg",
      social_links: {
        github: "https://github.com/johndoe",
        twitter: "https://twitter.com/johndoe",
        zenn: "https://zenn.dev/johndoe",
        qiita: "https://qiita.com/johndoe",
      },
    },
  },
};
