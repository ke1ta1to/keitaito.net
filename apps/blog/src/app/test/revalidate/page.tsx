import { Button } from "@repo/ui/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function TestRevalidatePage() {
  const revalidate = async () => {
    "use server";

    revalidatePath("/test/revalidate");
  };

  const now = new Date();
  return (
    <div>
      <h1>Test Revalidate</h1>
      <p>{now.toISOString()}</p>
      <form action={revalidate}>
        <Button type="submit">Revalidate</Button>
      </form>
    </div>
  );
}
