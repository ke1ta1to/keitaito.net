import type { Metadata } from "next";

import "./globals.css";
import { getEnv } from "@/lib/env-vars";

export const metadata = {
  title: {
    default: "Keita Ito",
    template: "%s | Keita Ito",
  },
  metadataBase: new URL(getEnv().customUrl),
  alternates: {
    canonical: "/",
  },
} satisfies Metadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className="text-neutral-700">{children}</body>
    </html>
  );
}
