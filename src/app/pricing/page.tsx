import PricingCards from '@/components/ui/PricingCards';

export default function PricingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-950 to-slate-950" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-6xl pt-20 pb-24">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            简单透明的定价
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            选择适合您的计划，随时升级或降级，无隐藏费用
          </p>
        </div>

        {/* 定价卡片组件 */}
        <PricingCards />

        {/* FAQ 区域 */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            常见问题
          </h2>
          <div className="space-y-4">
            {[
              {
                q: '积分如何计算？',
                a: '每张图片生成消耗10积分，视频生成消耗50积分。生成失败时会自动退还积分。',
              },
              {
                q: '可以随时取消订阅吗？',
                a: '是的，您可以随时取消。取消后您的订阅会持续到当期结束，但不会自动续费。',
              },
              {
                q: '年付有什么优惠？',
                a: '年付套餐享受8折优惠，相当于免费获得2个月使用时间。',
              },
              {
                q: '如何获取更多积分？',
                a: '您可以升级到更高级的订阅计划获取更多积分，也可以等待积分自动重置（根据您的订阅周期）。',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-900/40 border border-slate-800 rounded-xl p-5"
              >
                <h3 className="font-medium text-white mb-2">{item.q}</h3>
                <p className="text-sm text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}