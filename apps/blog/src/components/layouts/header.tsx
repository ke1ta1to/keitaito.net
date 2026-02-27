import logoImage from "@/assets/logo.svg";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-t-primary sticky top-0 z-10 border-t-4 bg-white py-3">
      <div className="flex mx-auto max-w-7xl items-center gap-4 px-4">
        <Image alt="keitaito.net" src={logoImage} className="h-6 w-auto" />
      </div>
    </header>
  );
}
