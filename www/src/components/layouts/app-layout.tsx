import { Header } from "./header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout(props: AppLayoutProps) {
  const { children } = props;

  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-4 pb-8">{children}</div>
    </>
  );
}
