import { AppFooter } from "./app-footer";
import { AppHeader } from "./app-header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-primary-500/10 via-secondary-500/10 to-primary-500/10 bg-gradient-to-br">
      <AppHeader />
      <div className="mx-auto min-h-screen max-w-7xl p-4">
        {children}
      </div>
      <AppFooter />
    </div>
  );
}
