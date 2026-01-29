import { defineConfig } from "orval";

export default defineConfig({
  client: {
    input: "./node_modules/@repo/functions/openapi/openapi.yaml",
    output: {
      target: "./src/lib/api",
      schemas: "./src/lib/api/model",
      namingConvention: "kebab-case",
      mode: "tags-split",
    },
  },
});
