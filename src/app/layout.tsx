import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { AppLayout } from "@/components/app-layout";

import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Keita Ito",
    template: "%s | Keita Ito",
  },
  description: "伊藤啓太のポートフォリオサイト",
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
