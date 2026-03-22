import type { Meta, StoryObj } from "@storybook/nextjs";

import { Profile } from "./profile";

const meta = {
  title: "Profile",
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
      school: "University of Example",
      image_url: "https://picsum.photos/200",
      social_links: {
        github: "https://github.com/johndoe",
        twitter: "https://twitter.com/johndoe",
        qiita: "https://qiita.com/johndoe",
        zenn: "https://zenn.dev/johndoe",
      },
    },
  },
};
