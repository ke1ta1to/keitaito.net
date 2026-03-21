import { TooltipProvider } from "@repo/ui/components/ui/tooltip";
import { JetBrains_Mono } from "next/font/google";

import { AppLayout } from "@/components/layouts/app-layout";
import { Providers } from "@/components/providers";

import "@/styles.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout(prpos: LayoutProps<"/">) {
  const { children } = prpos;

  return (
    <html lang="ja" className={jetbrainsMono.variable}>
      <body>
        <Providers>
          <TooltipProvider>
            <AppLayout>{children}</AppLayout>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
