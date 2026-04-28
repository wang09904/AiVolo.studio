import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-4">
          AiVolo.studio
        </h1>
        <p className="text-xl text-purple-200 mb-8">
          AI 图片生成，简单、酷炫、便宜
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <p className="text-white/80 mb-6">
            使用 Google 账户登录开始创作
          </p>

          <Link
            href="/api/auth/google"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-purple-500/30"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 登录
          </Link>
        </div>

        <div className="mt-8 flex gap-6 justify-center">
          <Link href="/pricing" className="text-purple-300 hover:text-white transition-colors">
            查看定价
          </Link>
          <Link href="/models" className="text-purple-300 hover:text-white transition-colors">
            模型广场
          </Link>
          <Link href="/templates" className="text-purple-300 hover:text-white transition-colors">
            模板
          </Link>
        </div>
      </div>
    </div>
  );
}