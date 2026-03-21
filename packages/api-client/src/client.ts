import createClient, { type ClientOptions } from "openapi-fetch";

import type { paths } from "./schema.js";

export function createApiClient(options?: ClientOptions) {
  return createClient<paths>(options);
}
