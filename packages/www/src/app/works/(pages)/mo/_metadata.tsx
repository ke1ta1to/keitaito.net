import thumbnail from "./_assets/thumbnail.jpg";

import type { WorkMetadata } from "@/app/types";

export const metadata: WorkMetadata = {
  title: "モバイルオーダーシステム「MO」",
  description: (
    <p>
      模擬店における汎用的なモバイルオーダーシステム
      <br />
      サークルでチーム開発を行っています
    </p>
  ),
  url: "/works/mo",
  thumbnail: {
    alt: "",
    src: thumbnail,
    width: 1600,
    height: 900,
  },
};
