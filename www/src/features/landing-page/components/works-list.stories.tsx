import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WorksList } from "./works-list";

const meta = {
  title: "landing-page/WorksList",
  component: WorksList,
} satisfies Meta<typeof WorksList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    works: [
      {
        id: "1",
        title: "Portfolio Website",
        slug: "portfolio-website",
        content:
          "A personal portfolio website showcasing my projects and skills.",
        thumbnail: "https://images.unsplash.com/photo-1761839259494-71caddcdd6b3?q=80&w=2070&auto=format&fit=crop",
      },
      {
        id: "2",
        title: "E-commerce Platform",
        slug: "ecommerce-platform",
        content:
          "An online platform for buying and selling products with secure payment integration.",
        thumbnail: "https://images.unsplash.com/photo-1761839258289-72f12b0de058?q=80&w=2070&auto=format&fit=crop",
      },
      {
        id: "3",
        title: "Blog Application",
        slug: "blog-application",
        content:
          "A full-featured blog application with user authentication and content management.",
        thumbnail: "https://images.unsplash.com/photo-1761839257870-06874bda71b5?q=80&w=2069&auto=format&fit=crop",
      },
    ],
  },
};
