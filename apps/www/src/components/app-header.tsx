import Image from "next/image";
import NextLink from "next/link";

import logoImg from "@/assets/logo.svg";

const links = [{ label: "Overview", href: "/" }];

export function AppHeader() {
  return (
    <header className="border-t-primary-500 sticky top-0 z-10 overflow-x-auto border-t-4 bg-white pt-3 pb-4 text-gray-900">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4">
        <NextLink href="/" className="shrink-0">
          <Image alt="keitaito.net" src={logoImg} className="h-6 w-auto" />
        </NextLink>
        <ul className="ml-auto flex space-x-4">
          {links.map((link) => (
            <li key={link.label}>
              <NextLink href={link.href} className="text-sm font-semibold">
                {link.label}
              </NextLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
