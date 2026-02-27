import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import { baseConfig } from "./base.js";
import eslintPluginReact from "eslint-plugin-react";
import globals from "globals";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";

export const reactInternalConfig = defineConfig([
  ...baseConfig,
  {
    files: ["**/*.{ts,tsx}"],
    ...eslintPluginReact.configs.flat.recommended,
    languageOptions: {
      ...eslintPluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  eslintPluginReactHooks.configs.flat.recommended,
  eslintConfigPrettier,
]);
