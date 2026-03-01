import type { Preview } from "@storybook/nextjs";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

document.documentElement.classList.add(jetbrainsMono.variable);

export const preview: Preview = {};
