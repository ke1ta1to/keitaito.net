"use client";

import type { components } from "@repo/api-client/schema";

import { apiClient } from "./api-client";
import { CrudResourcePanel } from "./crud-resource-panel";

type Activity = components["schemas"]["Activity"];

const fields = [
  { key: "title", label: "Title", type: "text" as const, required: true },
  { key: "date", label: "Date", type: "text" as const, required: true },
  {
    key: "description",
    label: "Description",
    type: "textarea" as const,
    required: true,
  },
];

export function ActivitiesPanel() {
  return (
    <CrudResourcePanel<Activity>
      title="Activity"
      queryKey="activities"
      fields={fields}
      listFn={() => apiClient.GET("/activities").then((res) => res.data)}
      createFn={(body) =>
        apiClient.POST("/activities", {
          body: body as components["schemas"]["ActivityCreateRequest"],
        })
      }
      updateFn={(id, body) =>
        apiClient.PUT("/activities/{id}", {
          params: { path: { id } },
          body: body as components["schemas"]["ActivityUpdateRequest"],
        })
      }
      deleteFn={(id) =>
        apiClient.DELETE("/activities/{id}", {
          params: { path: { id } },
        })
      }
    />
  );
}
