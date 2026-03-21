import Image from "next/image";
import Link from "next/link";

import logoImage from "@/assets/logo.svg";

export function Header() {
  return (
    <header className="border-t-primary sticky top-0 z-10 border-t-4 bg-white py-3">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4">
        <Link href="/">
          <Image
            alt="keitaito.net"
            src={logoImage}
            className="block h-6 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}
