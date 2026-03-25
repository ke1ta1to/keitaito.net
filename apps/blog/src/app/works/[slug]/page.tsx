import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getWork } from "@/lib/works";

export async function generateMetadata(
  props: PageProps<"/works/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const work = await getWork(slug);
  if (!work) return {};

  return {
    title: work.metadata.title,
    description: work.metadata.description,
    keywords: work.metadata.keywords,
  };
}

export default async function WorkPage(props: PageProps<"/works/[slug]">) {
  const { slug } = await props.params;
  const work = await getWork(slug);
  if (!work) notFound();

  const { Post, metadata } = work;
  return (
    <div className="space-y-4">
      <h1 className="my-16 text-center text-3xl font-bold">{metadata.title}</h1>
      <Image
        alt={`${metadata.title} thumbnail`}
        src={metadata.thumbnail}
        className="aspect-video object-cover"
      />
      <div className="prose prose-neutral prose-teal max-w-none">
        <Post />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [{ slug: "mo" }, { slug: "uec-3d-map" }];
}
