import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Profile } from "./profile";

const meta = {
  title: "landing-page/Profile",
  component: Profile,
} satisfies Meta<typeof Profile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    profile: {
      name: "John Doe",
      birthday: "1990-01-01",
      location: "New York, USA",
      school: "University of Example",
      image_url: "https://example.com/image.jpg",
      x: "https://x.com/johndoe",
      github: "https://github.com/johndoe",
      zenn: "https://zenn.dev/johndoe",
      qiita: "https://qiita.com/johndoe",
    },
  },
};
