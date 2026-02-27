import { JetBrains_Mono } from "next/font/google";

import "@/styles.css";
import { AppLayout } from "@/components/layouts/app-layout";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout(prpos: LayoutProps<"/">) {
  const { children } = prpos;

  return (
    <html lang="ja" className={jetbrainsMono.variable}>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
