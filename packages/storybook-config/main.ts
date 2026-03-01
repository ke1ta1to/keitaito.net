import { dirname } from "path";
import { fileURLToPath } from "url";

import type { StorybookConfig } from "@storybook/nextjs";

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

export const baseConfig: StorybookConfig = {
  stories: [],
  addons: [],
  framework: getAbsolutePath("@storybook/nextjs"),
  features: {
    experimentalRSC: true,
  },
};
