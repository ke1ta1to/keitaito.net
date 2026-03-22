import { Header } from "./header";

export interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout(props: AppLayoutProps) {
  const { children } = props;

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-4">{children}</div>
    </>
  );
}
