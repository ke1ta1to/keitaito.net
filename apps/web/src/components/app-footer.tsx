export function AppFooter() {
  return (
    <footer className="border-t border-white/20 bg-white/70 shadow-lg backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-neutral-600">
          (c) {new Date().getFullYear()} Keita Ito. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
