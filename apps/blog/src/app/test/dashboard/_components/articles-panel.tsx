"use client";

import type { components } from "@repo/api-client/schema";
import { Badge } from "@repo/ui/components/ui/badge";

import { apiClient } from "./api-client";
import { CrudResourcePanel } from "./crud-resource-panel";

type Article = components["schemas"]["Article"];

const fields = [
  { key: "title", label: "Title", type: "text" as const, required: true },
  { key: "url", label: "URL", type: "text" as const, required: true },
  { key: "liked_count", label: "Liked Count", type: "number" as const },
  {
    key: "published_at",
    label: "Published At",
    type: "text" as const,
    required: true,
  },
  {
    key: "source",
    label: "Source",
    type: "select" as const,
    options: [
      { label: "Zenn", value: "zenn" },
      { label: "Qiita", value: "qiita" },
    ],
  },
];

function renderCell(item: Article, key: string) {
  if (key === "source" && item.source) {
    return <Badge variant="secondary">{item.source}</Badge>;
  }
  return null;
}

export function ArticlesPanel() {
  return (
    <CrudResourcePanel<Article>
      title="Article"
      queryKey="articles"
      fields={fields}
      renderCell={renderCell}
      listFn={() => apiClient.GET("/articles").then((res) => res.data)}
      createFn={(body) =>
        apiClient.POST("/articles", {
          body: body as components["schemas"]["ArticleCreateRequest"],
        })
      }
      updateFn={(id, body) =>
        apiClient.PUT("/articles/{id}", {
          params: { path: { id } },
          body: body as components["schemas"]["ArticleUpdateRequest"],
        })
      }
      deleteFn={(id) =>
        apiClient.DELETE("/articles/{id}", {
          params: { path: { id } },
        })
      }
    />
  );
}
