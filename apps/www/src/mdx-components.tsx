import type { MDXComponents } from "mdx/types";
import NextLink from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: (props) =>
      props.href.startsWith("http") ? (
        <a {...props} target="_blank" rel="noopener noreferrer" />
      ) : (
        <NextLink href={props.href} {...props} />
      ),
  };
}
