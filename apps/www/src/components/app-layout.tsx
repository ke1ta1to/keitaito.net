import { AppFooter } from "./app-footer";
import { AppHeader } from "./app-header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-primary/20 via-secondary/10 to-primary/20 min-h-screen bg-gradient-to-br">
      <AppHeader />
      {children}
      <AppFooter />
    </div>
  );
}
