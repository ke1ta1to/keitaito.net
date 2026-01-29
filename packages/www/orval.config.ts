import { defineConfig } from "orval";

const input = "./node_modules/@repo/functions/openapi/openapi.yaml";

export default defineConfig({
  client: {
    input,
    output: {
      target: "./src/orval/client/index.ts",
      schemas: "./src/orval/client/models",
      namingConvention: "kebab-case",
      mode: "single",
      httpClient: "axios",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/orval/client-axios.ts",
          name: "customInstance",
        },
      },
    },
  },
  server: {
    input,
    output: {
      target: "./src/orval/server/index.ts",
      schemas: "./src/orval/server/models",
      namingConvention: "kebab-case",
      mode: "single",
      httpClient: "axios",
      client: "axios-functions",
      override: {
        mutator: {
          path: "./src/orval/server-axios.ts",
          name: "customInstance",
        },
      },
    },
  },
});
