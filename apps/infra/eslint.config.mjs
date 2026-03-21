import { baseConfig } from "@repo/eslint-config";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([...baseConfig, globalIgnores(["cdk.out/**"])]);
