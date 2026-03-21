import { Header } from "./header";

export function AppLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-4">{children}</div>
    </>
  );
}
