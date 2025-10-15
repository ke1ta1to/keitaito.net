import { RuleConfigSeverity } from "@commitlint/types";

/** @type {import('@commitlint/types').UserConfig} */
const Configuration = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [RuleConfigSeverity.Disabled],
  },
};

export default Configuration;
