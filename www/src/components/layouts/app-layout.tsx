import { Header } from "./header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout(props: AppLayoutProps) {
  const { children } = props;

  return (
    <>
      <Header />
      {children}
    </>
  );
}
