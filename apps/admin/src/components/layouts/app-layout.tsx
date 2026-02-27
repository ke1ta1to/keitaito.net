import { Header } from "./header";

export function AppLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <>
      <Header />
      {children}
    </>
  );
}
