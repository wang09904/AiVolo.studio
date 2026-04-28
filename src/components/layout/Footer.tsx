import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* 品牌 */}
          <div>
            <Link href="/" className="text-lg font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              AiVolo.studio
            </Link>
            <p className="text-sm text-slate-500 mt-2">
              AI 图片/视频生成工具<br />
              简单、酷炫、便宜
            </p>
          </div>

          {/* 产品 */}
          <div>
            <h4 className="font-medium text-white mb-3">产品</h4>
            <ul className="space-y-2">
              <li><Link href="/create" className="text-sm text-slate-400 hover:text-white transition-colors">生成图片</Link></li>
              <li><Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">定价</Link></li>
              <li><Link href="/models" className="text-sm text-slate-400 hover:text-white transition-colors">模型广场</Link></li>
            </ul>
          </div>

          {/* 资源 */}
          <div>
            <h4 className="font-medium text-white mb-3">资源</h4>
            <ul className="space-y-2">
              <li><Link href="/templates" className="text-sm text-slate-400 hover:text-white transition-colors">模板</Link></li>
              <li><Link href="/account" className="text-sm text-slate-400 hover:text-white transition-colors">账户</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">联系我们</Link></li>
            </ul>
          </div>

          {/* 法律 */}
          <div>
            <h4 className="font-medium text-white mb-3">法律</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">服务条款</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">隐私政策</Link></li>
              <li><Link href="/refund" className="text-sm text-slate-400 hover:text-white transition-colors">退款政策</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © 2026 AiVolo.studio. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}