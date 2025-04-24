import type { Meta, StoryObj } from "@storybook/react";

import { ContactCard } from "./contact-card";

const meta = {
  title: "Component/ContactCard",
  component: ContactCard,
} satisfies Meta<typeof ContactCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
