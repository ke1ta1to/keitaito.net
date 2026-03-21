export const revalidate = 10;

export default async function TestISRPage() {
  const now = new Date();
  return (
    <div>
      <h1>Test ISR</h1>
      <p>{now.toISOString()}</p>
    </div>
  );
}
