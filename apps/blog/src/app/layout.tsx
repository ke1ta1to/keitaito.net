import "../styles.css";
import { Noto_Sans_JP } from "next/font/google";

import { AppLayout } from "@/components/layouts/app-layouts";
import { cn } from "@/lib/utils";

const notoSans = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-sans" });

export default async function RootLayout(props: LayoutProps<"/">) {
  const { children } = props;

  return (
    <html lang="ja" className={cn("font-sans", notoSans.variable)}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.42/dist/katex.min.css"
          integrity="sha384-DVShYR21zvUU4zL2VjLlIbYSeiS43grntDO/Sm1DwmGGXKxGmvBlXWZ9lnyKhota"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
