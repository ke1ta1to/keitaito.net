export const dynamic = "force-dynamic";

export default async function TestSSRPage() {
  const now = new Date();
  return (
    <div>
      <h1>Test SSR</h1>
      <p>{now.toISOString()}</p>
    </div>
  );
}
