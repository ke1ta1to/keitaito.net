"use client";

import { Skills } from "@repo/ui/components/skills";
import { useQuery } from "@tanstack/react-query";

import { SkillsGrid } from "./_components/skills-grid";

import { PreviewLayout } from "@/components/preview-layout";
import { apiClient } from "@/lib/api-client";

export default function SkillsPage() {
  const { data } = useQuery({
    queryKey: ["skills"],
    queryFn: () => apiClient.GET("/skills").then((r) => r.data ?? []),
  });

  const skills = data ?? [];

  return (
    <PreviewLayout preview={<Skills skills={skills} />}>
      <SkillsGrid skills={skills} />
    </PreviewLayout>
  );
}
