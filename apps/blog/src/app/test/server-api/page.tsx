export const dynamic = "force-dynamic";

export default async function TestServerApiPage() {
  const res = await fetch(`${process.env.API_URL}activities`);
  const data = await res.json();

  return (
    <div>
      <h1>Test API Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
