import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

const components: MDXComponents = {
  wrapper: ({ children }: ComponentPropsWithoutRef<"div">) => (
    <div className="prose prose-neutral prose-teal max-w-none">{children}</div>
  ),
  a: ({ children, href, ...props }: ComponentPropsWithoutRef<"a">) =>
    href?.startsWith("/") ? (
      <Link href={href} {...props}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
