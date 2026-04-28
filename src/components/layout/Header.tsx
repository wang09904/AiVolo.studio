import Link from 'next/link';
import CreditBalance from '@/components/credits/CreditBalance';

export default function Header() {
  return (
    <header className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/50 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            AiVolo.studio
          </Link>
          <div className="flex gap-6 items-center">
            <Link href="/create" className="text-sm text-slate-400 hover:text-white transition-colors">
              生成
            </Link>
            <Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">
              定价
            </Link>
            <Link href="/models" className="text-sm text-slate-400 hover:text-white transition-colors">
              模型
            </Link>
            <Link href="/account" className="text-sm text-slate-400 hover:text-white transition-colors">
              账户
            </Link>
            <CreditBalance className="ml-4" />
          </div>
        </div>
      </nav>
    </header>
  );
}