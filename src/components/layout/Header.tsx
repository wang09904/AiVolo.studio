import Link from 'next/link';
import CreditBalance from '@/components/credits/CreditBalance';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-bg/80 backdrop-blur-xl">
      <nav className="mx-auto max-w-[1400px] px-6 py-6 lg:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-medium tracking-tight text-brand-text transition-colors hover:text-brand-cta">
            AiVolo<span className="text-brand-cta">.</span>studio
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/create" className="text-sm font-medium tracking-wide text-brand-muted transition-colors hover:text-brand-text">
              Create
            </Link>
            <Link href="/pricing" className="text-sm font-medium tracking-wide text-brand-muted transition-colors hover:text-brand-text">
              Pricing
            </Link>
            <Link href="/account" className="text-sm font-medium tracking-wide text-brand-muted transition-colors hover:text-brand-text">
              Account
            </Link>
            <div className="ml-4 pl-8 border-l border-brand-border h-6 flex items-center">
              <CreditBalance />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
