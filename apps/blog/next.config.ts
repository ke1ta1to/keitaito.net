import * as path from "node:path";

import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-math"],
    rehypePlugins: ["rehype-katex", "rehype-slug"],
  },
});

export default withMDX(nextConfig);
