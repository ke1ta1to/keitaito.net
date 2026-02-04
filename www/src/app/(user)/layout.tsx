import { Header } from "@/components/layouts/header";

export default async function UserLayout(props: LayoutProps<"/">) {
  const { children } = props;

  return (
    <>
      <Header />
      <div className="px-4 max-w-7xl mx-auto py-4">{children}</div>
    </>
  );
}
