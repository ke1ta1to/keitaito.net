import "./globals.css";

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
