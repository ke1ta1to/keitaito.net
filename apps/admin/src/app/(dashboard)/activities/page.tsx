"use client";

import { Activities } from "@repo/ui/components/activities";
import { useQuery } from "@tanstack/react-query";

import { ActivitiesList } from "./_components/activities-list";

import { PreviewLayout } from "@/components/preview-layout";
import { apiClient } from "@/lib/api-client";

export default function ActivitiesPage() {
  const { data } = useQuery({
    queryKey: ["activities"],
    queryFn: () => apiClient.GET("/activities").then((r) => r.data ?? []),
  });

  const activities = data ?? [];

  return (
    <PreviewLayout preview={<Activities activities={activities} />}>
      <ActivitiesList activities={activities} />
    </PreviewLayout>
  );
}
