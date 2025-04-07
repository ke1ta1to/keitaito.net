import thumbnail from "./_assets/thumbnail.jpg";

import type { WorkMetadata } from "@/app/types";

export const metadata: WorkMetadata = {
  title: "食神Wiki",
  description: <p>大学近くの飲食店である「食神」の情報をまとめたWiki</p>,
  url: "/works/shokujin-wiki",
  thumbnail: {
    alt: "",
    src: thumbnail,
    width: 1600,
    height: 900,
  },
};
