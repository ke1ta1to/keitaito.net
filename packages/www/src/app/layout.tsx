import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { AppLayout } from "@/components/app-layout";
import { getEnv } from "@/lib/env-vars";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Keita Ito",
    template: "%s | Keita Ito",
  },
  description: "伊藤啓太のポートフォリオサイト",
  keywords: ["ポートフォリオ", "エンジニア", "伊藤啓太", "Keita Ito"],
  creator: "Keita Ito",
  alternates: {
    canonical: "/",
  },
  metadataBase: new URL("/", getEnv().customUrl),
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className="text-gray-700">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
