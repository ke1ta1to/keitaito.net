import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ActivitiesList } from "./activities-list";

const meta = {
  title: "landing-page/ActivitiesList",
  component: ActivitiesList,
} satisfies Meta<typeof ActivitiesList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activities: [
      {
        id: "1",
        title: "Started a new project",
        date: "2024-01",
        description:
          "Kickoff for the new web application project focusing on e-commerce solutions.",
      },
      {
        id: "2",
        title: "Deployed version 1.0",
        date: "2024-02",
        description:
          "Successfully launched the first version of the application with core features.",
      },
    ],
  },
};
