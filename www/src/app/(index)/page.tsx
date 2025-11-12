import { DarkModeToggle } from "@/components/dark-mode-togge";
import { Button } from "@/components/ui/button";

export default async function IndexPage() {
  return (
    <div>
      <Button>Click me</Button>
      <p>{process.env.NEXT_PUBLIC_MESSAGE}</p>
      <DarkModeToggle />
    </div>
  );
}
