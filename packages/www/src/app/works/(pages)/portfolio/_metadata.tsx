import thumbnail from "./_assets/thumbnail.png";

import type { WorkMetadata } from "@/app/types";

export const metadata: WorkMetadata = {
  title: "ポートフォリオ",
  description: (
    <p>無駄に技術スタックを詰め込んだ、このポートフォリオサイトです</p>
  ),
  url: "/works/portfolio",
  thumbnail: {
    alt: "",
    src: thumbnail,
    width: 1600,
    height: 900,
  },
};
