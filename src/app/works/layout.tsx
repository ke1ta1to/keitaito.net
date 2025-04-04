export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="prose prose-img:mx-auto">{children}</div>;
}
