import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import storybook from "eslint-plugin-storybook";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

import { customRules } from "./base.js";

// eslint-config-next provides eslint recommended, import plugin, and @typescript-eslint.
// We add strict/stylistic typescript-eslint rules and our custom rules on top.
export const nextjsConfig = [
  ...nextVitals,
  ...nextTs,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  customRules,
  ...storybook.configs["flat/recommended"],
  eslintConfigPrettier,
  globalIgnores([
    ".next/**",
    ".open-next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "storybook-static/**",
  ]),
];
