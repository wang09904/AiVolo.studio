import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[oklch(28%_0.018_270)] bg-[oklch(11%_0.014_270)]">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* 品牌 */}
          <div>
            <Link href="/" className="text-lg font-bold text-[oklch(96%_0.01_270)]">
              AiVolo.studio
            </Link>
            <p className="text-sm text-[oklch(62%_0.016_270)] mt-2">
              Simple AI image generation for creators.
            </p>
          </div>

          {/* 产品 */}
          <div>
            <h4 className="font-medium text-[oklch(94%_0.01_270)] mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/create" className="text-sm text-[oklch(68%_0.018_270)] hover:text-[oklch(96%_0.01_270)] transition-colors">Create image</Link></li>
              <li><Link href="/pricing" className="text-sm text-[oklch(68%_0.018_270)] hover:text-[oklch(96%_0.01_270)] transition-colors">Pricing</Link></li>
              <li><Link href="/account" className="text-sm text-[oklch(68%_0.018_270)] hover:text-[oklch(96%_0.01_270)] transition-colors">Account</Link></li>
            </ul>
          </div>

          {/* 资源 */}
          <div>
            <h4 className="font-medium text-[oklch(94%_0.01_270)] mb-3">Available now</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-[oklch(68%_0.018_270)]">Text to image</span></li>
              <li><span className="text-sm text-[oklch(68%_0.018_270)]">Google OAuth</span></li>
              <li><Link href="/contact" className="text-sm text-[oklch(68%_0.018_270)] hover:text-[oklch(96%_0.01_270)] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* 法律 */}
          <div>
            <h4 className="font-medium text-[oklch(94%_0.01_270)] mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-[oklch(68%_0.018_270)] hover:text-[oklch(96%_0.01_270)] transition-colors">Terms of Use</Link></li>
              <li><Link href="/privacy" className="text-sm text-[oklch(68%_0.018_270)] hover:text-[oklch(96%_0.01_270)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refund" className="text-sm text-[oklch(68%_0.018_270)] hover:text-[oklch(96%_0.01_270)] transition-colors">Refund Policy</Link></li>
              <li><Link href="/contact" className="text-sm text-[oklch(68%_0.018_270)] hover:text-[oklch(96%_0.01_270)] transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[oklch(28%_0.018_270)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[oklch(62%_0.016_270)]">
            © 2026 AiVolo.studio. All rights reserved.
          </p>
          <Link href="/contact" className="text-sm text-[oklch(68%_0.018_270)] hover:text-[oklch(96%_0.01_270)] transition-colors">
            support@aivolo.studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
