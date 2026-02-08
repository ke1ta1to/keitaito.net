"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { ApiPaths } from "@/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ResponseDisplay } from "./response-display";

export function ArticlesTestPanel() {
  const listQuery = useQuery({
    queryKey: [ApiPaths.articles_list],
    queryFn: () => apiClient.GET("/articles"),
    enabled: false,
  });

  const collectMutation = useMutation({
    mutationFn: () => apiClient.POST("/articles/collect"),
  });

  const handleGetArticles = () => {
    listQuery.refetch();
  };

  const handleCollectArticles = () => {
    collectMutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Articles API Test Panel</h1>

      <div className="p-4 border rounded-lg space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground">
          API Endpoints
        </h2>

        {/* GET /articles */}
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleGetArticles}>
              GET /articles
            </Button>
          </div>
          <ResponseDisplay
            isLoading={listQuery.isFetching}
            isError={listQuery.isError}
            data={listQuery.data}
            error={listQuery.error}
          />
        </div>

        {/* POST /articles/collect */}
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCollectArticles}
              disabled={collectMutation.isPending}
            >
              POST /articles/collect
            </Button>
          </div>
          <ResponseDisplay
            isLoading={collectMutation.isPending}
            isError={collectMutation.isError}
            data={
              collectMutation.isSuccess
                ? { message: "Articles collected successfully" }
                : null
            }
            error={collectMutation.error}
          />
        </div>
      </div>
    </div>
  );
}
