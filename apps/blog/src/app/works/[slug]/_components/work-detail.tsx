import Image from "next/image";

import { MarkdownRenderer } from "./markdown-renderer";

export interface WorkDetailProps {
  work: {
    title: string;
    content: string;
    thumbnail_url?: string | null;
  };
}

export function WorkDetail({ work }: WorkDetailProps) {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">{work.title}</h1>
      {work.thumbnail_url && (
        <Image
          alt={work.title}
          src={work.thumbnail_url}
          width={1280}
          height={720}
          className="mt-4 aspect-video w-full rounded-lg object-cover"
        />
      )}
      <div className="mt-8">
        <MarkdownRenderer content={work.content} />
      </div>
    </article>
  );
}
