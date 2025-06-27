import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: {
    default: "Keita Ito",
    template: "%s | Keita Ito",
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
