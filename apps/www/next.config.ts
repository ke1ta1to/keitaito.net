import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
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

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
