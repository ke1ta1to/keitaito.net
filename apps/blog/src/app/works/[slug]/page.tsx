import { notFound } from "next/navigation";

import { WorkDetail } from "./_components/work-detail";

import { apiClient } from "@/lib/api-client";

export async function generateStaticParams() {
  const { data } = await apiClient.GET("/works");
  if (!data) return [];
  return data.map((work) => ({ slug: work.slug }));
}

export default async function WorkDetailPage(
  props: PageProps<"/works/[slug]">,
) {
  const { slug } = await props.params;
  const { data: works } = await apiClient.GET("/works");
  const work = works?.find((w) => w.slug === slug);
  if (!work) notFound();
  return <WorkDetail work={work} />;
}
