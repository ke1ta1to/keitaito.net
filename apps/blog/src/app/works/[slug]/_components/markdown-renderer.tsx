"use client";

import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import { Streamdown } from "streamdown";

import "katex/dist/katex.min.css";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <Streamdown plugins={{ code, cjk, math, mermaid }}>{content}</Streamdown>
  );
}
