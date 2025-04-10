import type { PropsWithChildren } from "react";

import { AppLayout } from "@/components/app-layout";

import "./globals.css";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className="text-gray-700">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
