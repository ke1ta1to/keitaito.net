import { defineConfig } from "orval";

export default defineConfig({
  client: {
    input: "./node_modules/@repo/functions/openapi/openapi.yaml",
    output: {
      target: "./src/gen/api/endpoints",
      schemas: "./src/gen/api/model",
      namingConvention: "kebab-case",
      mode: "tags-split",
      httpClient: "axios",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/lib/mutator.ts",
          name: "customInstance",
        },
      },
    },
  },
});
