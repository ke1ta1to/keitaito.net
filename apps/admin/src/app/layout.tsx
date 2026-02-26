export default async function RootLayout(prpos: LayoutProps<"/">) {
  const { children } = prpos;

  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
