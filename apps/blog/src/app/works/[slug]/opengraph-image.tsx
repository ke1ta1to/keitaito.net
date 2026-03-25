import { ImageResponse } from "next/og";

import { getWork } from "@/lib/works";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface OpenGraphImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OpenGraphImage(props: OpenGraphImageProps) {
  const { slug } = await props.params;
  const work = await getWork(slug);
  if (!work) throw new Error(`Work not found, slug: ${slug}`);
  const { metadata } = work;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      {metadata.title}
    </div>,
  );
}
