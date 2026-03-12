import type { Meta, StoryObj } from "@storybook/nextjs";

import { Profile, ProfileSkeleton } from "./profile";

const meta = {
  title: "Profile",
  component: Profile,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Profile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: StoryObj = {
  render: () => <ProfileSkeleton />,
};

export const Default: Story = {
  args: {
    profile: {
      name: "John Doe",
      birthday: "1995-06-15",
      location: "New York",
      school: "University of Chicago",
      image_url: "https://randomuser.me/api/portraits/men/1.jpg",
      github: "https://github.com/johndoe",
      twitter: "https://twitter.com/johndoe",
      zenn: "https://zenn.dev/johndoe",
      qiita: "https://qiita.com/johndoe",
    },
  },
};
