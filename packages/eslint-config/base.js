import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginImport from "eslint-plugin-import";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export const baseConfig = defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  eslintPluginImport.flatConfigs.recommended,
  {
    rules: {
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: [],
      },
    },
  },
  eslintConfigPrettier,
);
