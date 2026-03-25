import fs from "node:fs";
import path from "node:path";

import { z } from "zod";

const metadataSchema = z.object({
  title: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  // node_modules/next/dist/shared/lib/get-img-props.d.ts
  thumbnail: z.object({
    src: z.string(),
    height: z.number(),
    width: z.number(),
    blurDataURL: z.string().optional(),
    blurWidth: z.number().optional(),
    blurHeight: z.number().optional(),
  }),
});

type Metadata = z.infer<typeof metadataSchema> & {
  slug: string;
};

export type WorkMetadata = Metadata;

function parseMetadata(slug: string, raw: unknown): Metadata {
  const parsed = metadataSchema.parse(raw);
  return { ...parsed, slug };
}

export async function getWork(slug: string) {
  const dir = path.join(process.cwd(), "src", "content", "works", slug);
  if (!fs.existsSync(dir)) return null;

  const { default: Post, metadata } = await import(
    `@/content/works/${slug}/index.mdx`
  );

  return { Post, metadata: parseMetadata(slug, metadata) };
}

export async function getAllWorks() {
  const dir = path.join(process.cwd(), "src", "content", "works");
  const slugs = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const works = await Promise.all<WorkMetadata>(
    slugs.map(async (slug) => {
      const { metadata } = await import(`@/content/works/${slug}/index.mdx`);
      return parseMetadata(slug, metadata);
    }),
  );

  return works;
}
