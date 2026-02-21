import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import turbo from "eslint-plugin-turbo";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  turbo.configs["flat/recommended"],
  eslintConfigPrettier,
  globalIgnores(["dist/**", "node_modules/**"]),
);
