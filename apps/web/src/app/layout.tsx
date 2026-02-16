export default async function RootLayout(props: LayoutProps<"/">) {
  const { children } = props;

  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
