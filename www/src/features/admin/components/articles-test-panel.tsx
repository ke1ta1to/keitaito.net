"use client";

import { apiClient } from "@/lib/api-client";
import { ApiPaths } from "@/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EndpointButton } from "./endpoint-button";
import { TestPanelLayout } from "./test-panel-layout";

export function ArticlesTestPanel() {
  const listQuery = useQuery({
    queryKey: [ApiPaths.articles_list],
    queryFn: () => apiClient.GET("/articles"),
    enabled: false,
  });

  const collectMutation = useMutation({
    mutationFn: () => apiClient.POST("/articles/collect"),
  });

  return (
    <TestPanelLayout title="Articles API Test Panel">
      {/* GET /articles */}
      <EndpointButton
        label="GET /articles"
        onClick={() => listQuery.refetch()}
        isLoading={listQuery.isFetching}
        isError={listQuery.isError}
        data={listQuery.data}
        error={listQuery.error}
      />

      {/* POST /articles/collect */}
      <EndpointButton
        label="POST /articles/collect"
        onClick={() => collectMutation.mutate()}
        isLoading={collectMutation.isPending}
        isError={collectMutation.isError}
        data={null}
        error={collectMutation.error}
        disabled={collectMutation.isPending}
        successData={
          collectMutation.isSuccess
            ? { message: "Articles collected successfully" }
            : null
        }
      />
    </TestPanelLayout>
  );
}
