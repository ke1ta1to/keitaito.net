import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Works | Keita Ito",
    template: "%s | Works | Keita Ito",
  },
};

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="prose prose-img:mx-auto">{children}</div>;
}
