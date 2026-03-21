import type { Preview } from "@storybook/nextjs";
import { Noto_Sans_JP } from "next/font/google";

import "../src/styles.css";

const notoSans = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-sans" });

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className={`font-sans ${notoSans.variable}`}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
