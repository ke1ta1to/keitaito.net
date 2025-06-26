import { AppFooter } from "./app-footer";
import { AppHeader } from "./app-header";

import { cn } from "@/utils/cn";

interface AppLayoutProps {
  children: React.ReactNode;
  bgColor?: "white" | "gradient";
}

export default function AppLayout({
  children,
  bgColor = "white",
}: AppLayoutProps) {
  return (
    <div
      className={cn(
        bgColor === "gradient" &&
          "from-primary-500/10 via-secondary-500/10 to-primary-500/10 bg-gradient-to-br",
      )}
    >
      <AppHeader />
      <div className="mx-auto min-h-screen max-w-7xl">{children}</div>
      <AppFooter />
    </div>
  );
}
