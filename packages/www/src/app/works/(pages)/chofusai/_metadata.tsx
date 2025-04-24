import thumbnail from "./_assets/thumbnail.png";

import type { WorkMetadata } from "@/app/types";

export const metadata: WorkMetadata = {
  title: "第74回調布祭ウェブサイト",
  description: (
    <p>2024年11月に開催された電通大の学園祭「調布祭」のウェブサイト</p>
  ),
  url: "/works/chofusai",
  thumbnail: {
    alt: "",
    src: thumbnail,
    width: 1600,
    height: 900,
  },
};
