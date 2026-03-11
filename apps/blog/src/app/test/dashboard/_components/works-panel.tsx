"use client";

import type { components } from "@repo/api-client/schema";

import { apiClient } from "./api-client";
import { CrudResourcePanel } from "./crud-resource-panel";

type Work = components["schemas"]["Work"];

const fields = [
  { key: "title", label: "Title", type: "text" as const, required: true },
  { key: "slug", label: "Slug", type: "text" as const, required: true },
  {
    key: "content",
    label: "Content",
    type: "textarea" as const,
    required: true,
  },
  { key: "thumbnail_url", label: "Thumbnail URL", type: "text" as const },
];

export function WorksPanel() {
  return (
    <CrudResourcePanel<Work>
      title="Work"
      queryKey="works"
      fields={fields}
      listFn={() => apiClient.GET("/works").then((res) => res.data)}
      createFn={(body) =>
        apiClient.POST("/works", {
          body: body as components["schemas"]["WorkCreateRequest"],
        })
      }
      updateFn={(id, body) =>
        apiClient.PUT("/works/{id}", {
          params: { path: { id } },
          body: body as components["schemas"]["WorkUpdateRequest"],
        })
      }
      deleteFn={(id) =>
        apiClient.DELETE("/works/{id}", {
          params: { path: { id } },
        })
      }
    />
  );
}
