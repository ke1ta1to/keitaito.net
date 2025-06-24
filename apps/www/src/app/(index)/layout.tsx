import AppLayout from "@/components/app-layout";

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <div className="mt-4 mb-4 px-2">{children}</div>
    </AppLayout>
  );
}
