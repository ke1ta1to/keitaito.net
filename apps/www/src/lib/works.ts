import { promises as fs } from "fs";
import { join } from "path";

import type { StaticImageData } from "next/image";
import { z } from "zod";

// 定数
const WORKS_DIRECTORY = join(process.cwd(), "src/app/works");
const THUMBNAIL_WIDTH = 1600;
const THUMBNAIL_HEIGHT = 900;

// スキーマ定義
const WorkMetadataFromMDXSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string()),
});

// 型定義
export type WorkThumbnail = {
  alt: string;
  src: StaticImageData;
  width: number;
  height: number;
};

export type WorkMetadata = z.infer<typeof WorkMetadataFromMDXSchema> & {
  slug: string;
  url: string;
  thumbnail: WorkThumbnail;
};

/**
 * Worksディレクトリ内のサブディレクトリ名（slug）を取得
 * @returns Work slugの配列
 */
export async function getWorkSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(WORKS_DIRECTORY, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort(); // アルファベット順でソート
  } catch (error) {
    console.error("Failed to read works directory:", error);
    return [];
  }
}

/**
 * MDXファイルからメタデータを取得
 * @param slug Work slug
 * @returns MDXから取得したメタデータ
 */
async function getMetadataFromMDX(slug: string) {
  const mdxModule = await import(`@/app/works/${slug}/page.mdx`);
  const rawMetadata = mdxModule.metadata;

  if (!rawMetadata) {
    throw new Error(`No metadata exported from MDX file for slug: ${slug}`);
  }

  return WorkMetadataFromMDXSchema.parse(rawMetadata);
}

/**
 * サムネイル画像を取得
 * @param slug Work slug
 * @param title Work title
 * @returns WorkThumbnailオブジェクト
 */
async function getThumbnail(
  slug: string,
  title: string,
): Promise<WorkThumbnail> {
  const thumbnailModule = await import(`@/app/works/${slug}/_thumbnail.png`);

  return {
    alt: `${title}のサムネイル`,
    src: thumbnailModule.default,
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
  };
}

/**
 * 指定されたslugのWorkメタデータを取得
 * @param slug Work slug（ディレクトリ名）
 * @returns WorkMetadataオブジェクト
 * @throws {Error} メタデータが見つからない、または無効な場合
 */
export async function getWorkMetadataBySlug(
  slug: string,
): Promise<WorkMetadata> {
  try {
    // MDXからメタデータを取得
    const metadataFromMDX = await getMetadataFromMDX(slug);

    // サムネイル画像を取得
    const thumbnail = await getThumbnail(slug, metadataFromMDX.title);

    // 完全なメタデータを構築
    return {
      ...metadataFromMDX,
      slug,
      url: `/works/${slug}`,
      thumbnail,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = `Invalid metadata format for work "${slug}": ${error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ")}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    // インポートエラーの場合
    const message =
      error instanceof Error
        ? error.message
        : `Work metadata not found for slug: ${slug}`;
    console.error(message, error);
    throw new Error(message);
  }
}

/**
 * 指定されたslugのWorkメタデータを安全に取得（エラー時はnullを返す）
 * @param slug Work slug
 * @returns WorkMetadataまたはnull
 */
async function getWorkMetadataSafe(slug: string): Promise<WorkMetadata | null> {
  try {
    return await getWorkMetadataBySlug(slug);
  } catch {
    // エラーログは getWorkMetadataBySlug 内で出力済み
    return null;
  }
}

/**
 * すべてのWorkメタデータを取得
 * @returns WorkMetadataオブジェクトの配列（有効なもののみ）
 */
export async function getAllWorkMetadata(): Promise<WorkMetadata[]> {
  const slugs = await getWorkSlugs();

  if (slugs.length === 0) {
    return [];
  }

  const metadataPromises = slugs.map((slug) => getWorkMetadataSafe(slug));
  const metadataResults = await Promise.all(metadataPromises);

  // nullを除外して有効なメタデータのみ返す
  return metadataResults.filter(
    (metadata): metadata is WorkMetadata => metadata !== null,
  );
}
