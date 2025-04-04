import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const nextConfig: NextConfig = {
  output: "standalone",
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkMath, remarkBreaks],
    rehypePlugins: [rehypeKatex],
    remarkRehypeOptions: {
      footnoteLabel: "注釈",
    },
  },
});

export default withMDX(nextConfig);
