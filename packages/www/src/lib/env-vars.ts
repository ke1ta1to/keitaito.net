import { z } from "zod";

const envSchema = z.object({
  customUrl: z.string().url(),
});

export function getEnv() {
  const env = {
    customUrl: process.env.CUSTOM_URL,
  };

  const result = envSchema.safeParse(env);

  if (!result.success) {
    console.error("Invalid environment variables", result.error.format());
    throw new Error("Invalid environment variables");
  }

  return result.data;
}
