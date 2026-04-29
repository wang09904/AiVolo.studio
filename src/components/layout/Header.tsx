import Link from 'next/link';
import CreditBalance from '@/components/credits/CreditBalance';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[oklch(28%_0.018_270)] bg-[oklch(13%_0.016_270_/_0.92)] backdrop-blur">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[oklch(96%_0.01_270)]">
            AiVolo.studio
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/create" className="text-sm text-[oklch(72%_0.018_270)] transition-colors hover:text-[oklch(96%_0.01_270)]">
              Create
            </Link>
            <Link href="/pricing" className="text-sm text-[oklch(72%_0.018_270)] transition-colors hover:text-[oklch(96%_0.01_270)]">
              Pricing
            </Link>
            <Link href="/account" className="text-sm text-[oklch(72%_0.018_270)] transition-colors hover:text-[oklch(96%_0.01_270)]">
              Account
            </Link>
            <CreditBalance className="ml-4" />
          </div>
        </div>
      </nav>
    </header>
  );
}
