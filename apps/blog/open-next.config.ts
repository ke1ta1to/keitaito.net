import type { OpenNextConfig } from "@opennextjs/aws/types/open-next";

const config = {
  default: {
    override: {
      wrapper: "aws-lambda-streaming",
    },
  },
  buildCommand: "next build",
} satisfies OpenNextConfig;

export default config;
