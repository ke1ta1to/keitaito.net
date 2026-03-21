import "../styles.css";
import { Noto_Sans_JP } from "next/font/google";

import { cn } from "@/lib/utils";

const notoSans = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout(props: LayoutProps<"/">) {
  const { children } = props;

  return (
    <html lang="ja" className={cn("font-sans", notoSans.variable)}>
      <body>{children}</body>
    </html>
  );
}
