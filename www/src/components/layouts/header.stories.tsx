import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header } from "./header";

const meta = {
  title: "layouts/Header",
  component: Header,
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
