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
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 shadow-lg backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <NextLink
            href="/"
            className="shrink-0 transition-all duration-150 hover:opacity-80 active:scale-95"
          >
            <Image
              alt="keitaito.net"
              src="/logo.svg"
              width={317}
              height={39}
              className="h-6 w-auto"
            />
          </NextLink>

          <nav className="hidden items-center space-x-1 md:flex">
            {links.map((link) => (
              <NextLink
                key={link.label}
                href={link.href}
                className="hover:text-primary rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 backdrop-blur-sm transition-all duration-150 hover:bg-white/40"
              >
                {link.label}
              </NextLink>
            ))}
          </nav>

          <button
            className="hover:text-primary rounded-lg p-2 text-neutral-700 backdrop-blur-sm transition-all duration-150 hover:bg-white/40 md:hidden"
            aria-label="メニューを開く"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
