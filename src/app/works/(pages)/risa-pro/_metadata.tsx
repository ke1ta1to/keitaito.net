import thumbnail from "./_assets/thumbnail.png";

import type { WorkMetadata } from "@/app/types";

export const metadata: WorkMetadata = {
  title: "りさプロ",
  description: (
    <p>
      授業で作成したJavaのゲームです。
      <br />
      AWSを組み込んだオンライン機能やウェブサイトを作成しました
    </p>
  ),
  url: "/works/risa-pro",
  thumbnail: {
    alt: "",
    src: thumbnail,
    width: 1600,
    height: 900,
  },
};
