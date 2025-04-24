import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: (props) =>
      props.href.startsWith("http") ? (
        <a {...props} target="_blank" rel="noopener noreferrer" />
      ) : (
        <Link href={props.href} {...props} />
      ),
  };
}
