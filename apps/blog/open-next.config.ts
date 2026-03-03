import type { OpenNextConfig } from "@opennextjs/aws/types/open-next";

const config = {
  default: {},
  buildCommand: "next build",
  dangerous: {
    disableIncrementalCache: true,
  },
} satisfies OpenNextConfig;

export default config;
