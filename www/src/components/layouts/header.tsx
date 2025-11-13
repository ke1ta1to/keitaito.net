import Image from "next/image";

import logo from "./logo.svg";

export function Header() {
  return (
    <header className="border-t-primary flex border-t-8 bg-white px-4 py-2">
      <Image alt="keitaito.net" src={logo} className="h-6 w-auto" />
    </header>
  );
}
