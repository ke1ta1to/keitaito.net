import { Meta, StoryObj } from "@storybook/nextjs";
import { Activities } from "./activities";

const meta = {
  title: "Activities",
  component: Activities,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Activities>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
