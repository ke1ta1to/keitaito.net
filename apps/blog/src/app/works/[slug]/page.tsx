import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { CreativeWork, WithContext } from "schema-dts";

import { SITE_URL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getAllWorks, getWork } from "@/lib/works";

export async function generateMetadata(
  props: PageProps<"/works/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const work = await getWork(slug);
  if (!work) return {};

  const { title, description, keywords } = work.metadata;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/works/${slug}`,
    },
  };
}

export default async function WorkPage(props: PageProps<"/works/[slug]">) {
  const { slug } = await props.params;
  const work = await getWork(slug);
  if (!work) notFound();

  const { Post, metadata } = work;

  const jsonLd: WithContext<CreativeWork> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: metadata.title,
    description: metadata.description,
    url: new URL(`/works/${slug}`, SITE_URL).href,
    image: new URL(metadata.thumbnail.src, SITE_URL).href,
    dateCreated: metadata.createdAt,
    dateModified: metadata.updatedAt,
    keywords: metadata.keywords.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-4">
        <div className="my-16 text-center">
          <h1 className="text-3xl font-bold">{metadata.title}</h1>
          <div className="text-muted-foreground mt-4 text-sm">
            {formatDate(metadata.createdAt)} 投稿 /{" "}
            {formatDate(metadata.updatedAt)} 最終更新
          </div>
        </div>
        <Image
          alt={`${metadata.title} thumbnail`}
          src={metadata.thumbnail}
          className="aspect-video object-cover"
        />
        <div className="prose prose-neutral prose-teal max-w-none">
          <Post />
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const works = await getAllWorks();
  return works.map(({ slug }) => ({ slug }));
}
