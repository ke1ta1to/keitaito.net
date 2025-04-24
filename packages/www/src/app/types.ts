import type Image from "next/image";
import type { ComponentProps } from "react";

export type WorkMetadata = {
  title: string;
  description: React.ReactNode;
  url: string;
  thumbnail: ComponentProps<typeof Image>;
};
