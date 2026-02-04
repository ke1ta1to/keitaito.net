import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Contact } from "./contact";

const meta = {
  title: "landing-page/Contact",
  component: Contact,
} satisfies Meta<typeof Contact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    contact: {
      email: "example@example.com",
      x: "https://x.com/example",
    },
  },
};
