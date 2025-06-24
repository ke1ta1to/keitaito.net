import type { Meta, StoryObj } from "@storybook/nextjs";

import { ContactCard } from "./contact-card";

import { contact } from "@/constants/data";

const meta = {
  title: "Components/ContactCard",
  component: ContactCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    contact: {
      description: "連絡先情報を含むオブジェクト",
    },
  },
} satisfies Meta<typeof ContactCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    contact: contact,
  },
};

export const Fullscreen: Story = {
  args: {
    contact: contact,
  },
  parameters: {
    layout: "fullscreen",
  },
};
