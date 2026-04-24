import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between py-4">
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight transition-colors hover:text-primary"
      >
        MetaCheck
      </Link>
      <ThemeToggle />
    </header>
  );
}
