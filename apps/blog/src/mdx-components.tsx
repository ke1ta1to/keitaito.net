import type { MDXComponents } from "mdx/types";
import Link from "next/link";

const components = {
  wrapper: ({ children }) => (
    <div className="prose prose-neutral prose-teal max-w-none">{children}</div>
  ),
  a: ({ children, href, ...props }) =>
    href.startsWith("/") ? (
      <Link href={href} {...props}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
