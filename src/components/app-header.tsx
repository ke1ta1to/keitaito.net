import Image from "next/image";
import NextLink from "next/link";

const links = [
  { label: "Overview", href: "/" },
  { label: "Articles", href: "/articles" },
  { label: "Works", href: "/works" },
  { label: "Contact", href: "/contact" },
];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-t-4 border-t-teal-300 bg-white pt-3 pb-4 text-gray-900">
      <div className="mx-auto flex max-w-7xl items-center px-4">
        <NextLink href="/" className="shrink-0">
          <Image
            alt="keitaito.net"
            src="/logo.svg"
            width={317}
            height={39}
            className="h-6 w-auto"
          />
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
