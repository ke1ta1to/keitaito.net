import type { Meta, StoryObj } from "@storybook/nextjs";

import { Contact, ContactSkeleton } from "./contact";

const meta = {
  title: "Contact",
  component: Contact,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Contact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: StoryObj = {
  render: () => <ContactSkeleton />,
};

export const Default: Story = {
  args: {
    contact: {
      email: "example@example.com",
      twitter: "https://x.com/example",
    },
  },
};
