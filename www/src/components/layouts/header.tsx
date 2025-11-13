import Image from "next/image";

import { DarkModeToggle } from "../dark-mode-togge";

import logo from "./logo.svg";

export function Header() {
  return (
    <div className="border-t-primary bg-background border-t-8">
      <header className="mx-auto flex max-w-6xl items-center px-4">
        <Image
          alt="keitaito.net"
          src={logo}
          className="my-2 mr-auto h-6 w-auto"
        />
        <DarkModeToggle />
      </header>
    </div>
  );
}
