import type { Preview } from "@storybook/nextjs-vite";
import { JetBrains_Mono } from "next/font/google";
import "../src/app/globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

document.documentElement.classList.add(jetbrainsMono.variable);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
