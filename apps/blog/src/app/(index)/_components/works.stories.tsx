import type { Meta, StoryObj } from "@storybook/nextjs";

import { Works } from "./works";

const meta = {
  title: "Works",
  component: Works,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Works>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    works: [
      {
        title: "Personal Blog",
        description: "A personal blog built with Next.js and Tailwind CSS.",
        keywords: ["Next.js", "Tailwind CSS", "TypeScript"],
        slug: "personal-blog",
        thumbnail: {
          src: "https://picsum.photos/seed/blog/1280/720",
          height: 720,
          width: 1280,
        },
      },
      {
        title: "Weather App",
        description:
          "A weather forecast app using OpenWeatherMap API with location search.",
        keywords: ["React", "API", "Weather"],
        slug: "weather-app",
        thumbnail: {
          src: "https://picsum.photos/seed/weather/1280/720",
          height: 720,
          width: 1280,
        },
      },
      {
        title: "Task Manager",
        description:
          "A simple task management tool with drag-and-drop support.",
        keywords: ["Vue.js", "Drag and Drop", "Firebase"],
        slug: "task-manager",
        thumbnail: {
          src: "https://picsum.photos/seed/task/1280/720",
          height: 720,
          width: 1280,
        },
      },
      {
        title: "Chat Application",
        description: "Real-time chat app powered by WebSocket and Node.js.",
        keywords: ["WebSocket", "Node.js", "Real-time"],
        slug: "chat-app",
        thumbnail: {
          src: "https://picsum.photos/seed/chat/1280/720",
          height: 720,
          width: 1280,
        },
      },
      {
        title: "Portfolio Site",
        description:
          "A minimal portfolio website with dark mode and animations.",
        keywords: ["Portfolio", "Framer Motion", "Dark Mode"],
        slug: "portfolio-site",
        thumbnail: {
          src: "https://picsum.photos/seed/portfolio/1280/720",
          height: 720,
          width: 1280,
        },
      },
    ],
  },
};
