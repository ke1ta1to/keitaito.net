"use client";

import type { components } from "@repo/api-client/schema";

import { apiClient } from "./api-client";
import { CrudResourcePanel } from "./crud-resource-panel";

type Skill = components["schemas"]["Skill"];

const fields = [
  { key: "name", label: "Name", type: "text" as const, required: true },
  {
    key: "icon_url",
    label: "Icon URL",
    type: "text" as const,
    required: true,
  },
];

export function SkillsPanel() {
  return (
    <CrudResourcePanel<Skill>
      title="Skill"
      queryKey="skills"
      fields={fields}
      listFn={() => apiClient.GET("/skills").then((res) => res.data)}
      createFn={(body) =>
        apiClient.POST("/skills", {
          body: body as components["schemas"]["SkillCreateRequest"],
        })
      }
      updateFn={(id, body) =>
        apiClient.PUT("/skills/{id}", {
          params: { path: { id } },
          body: body as components["schemas"]["SkillUpdateRequest"],
        })
      }
      deleteFn={(id) =>
        apiClient.DELETE("/skills/{id}", {
          params: { path: { id } },
        })
      }
    />
  );
}
