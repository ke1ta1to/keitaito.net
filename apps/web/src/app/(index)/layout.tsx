import AppLayout from "@/components/app-layout";

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
