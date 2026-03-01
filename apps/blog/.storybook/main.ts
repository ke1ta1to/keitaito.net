import { baseConfig } from "@repo/storybook-config/main";
import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  ...baseConfig,
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
};

export default config;
