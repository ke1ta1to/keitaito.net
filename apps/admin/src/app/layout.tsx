import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";
import { JetBrains_Mono } from "next/font/google";

import { AppSidebar } from "@/components/app-sidebar";
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
        <Providers>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger />
              </header>
              <main className="flex-1 p-4 lg:p-6">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
