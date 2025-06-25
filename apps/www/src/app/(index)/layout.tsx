import AppLayout from "@/components/app-layout";

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout bgColor="gradient">
      <div className="mt-4 px-2">{children}</div>
    </AppLayout>
  );
}
