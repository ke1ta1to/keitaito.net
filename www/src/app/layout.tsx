import { Providers } from "@/components/providers";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={jetbrainsMono.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
