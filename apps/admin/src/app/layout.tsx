import { JetBrains_Mono } from "next/font/google";

import { Providers } from "@/components/providers";

import "@/styles.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout(props: LayoutProps<"/">) {
  const { children } = props;

  return (
    <html lang="ja" className={jetbrainsMono.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
