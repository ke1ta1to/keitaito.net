import thumbnail from "./_assets/thumbnail.png";

import type { WorkMetadata } from "@/app/types";

export const metadata: WorkMetadata = {
  title: "UEC 3D Map",
  description: <p>電気通信大学をウェブ上で3Dで見ることができます</p>,
  url: "/works/uec-3d-map",
  thumbnail: {
    alt: "",
    src: thumbnail,
    width: 1600,
    height: 900,
  },
};
