'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Feature {
  text: string;
  free?: string;
  lite?: string;
  pro?: string;
}

const FULL_FEATURES: Feature[] = [
  { text: '积分', free: '20', lite: '300/月', pro: '800/月' },
  { text: '图片额度/月', free: '20张', lite: '300张', pro: '800张' },
  { text: '视频额度/月', free: '2个', lite: '30个', pro: '80个' },
  { text: '并行任务', free: '1', lite: '2', pro: '3' },
  { text: '可用模型', free: '基础模型', lite: '✅ 全部', pro: '✅ 全部' },
  { text: '文生图', free: '✅', lite: '✅', pro: '✅' },
  { text: '图生图', free: '✅', lite: '✅', pro: '✅' },
  { text: '文生视频', free: '✅', lite: '✅', pro: '✅' },
  { text: '图生视频', free: '✅', lite: '✅', pro: '✅' },
  { text: '模板和特效', free: '✅', lite: '✅', pro: '✅' },
  { text: '生成速度', free: '普通', lite: '普通', pro: '优先' },
  { text: '输出质量', free: '标准', lite: '高清', pro: '4K/高清' },
  { text: '水印', free: '有', lite: '无', pro: '无' },
  { text: '历史记录', free: '7天', lite: '30天', pro: '1年' },
  { text: '客服支持', free: '社区', lite: '邮件', pro: '优先' },
];

interface PricingTier {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  badge?: string;
  isFree?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    isFree: true,
  },
  {
    name: 'Lite',
    monthlyPrice: 15,
    yearlyPrice: 10,
    badge: '最划算',
  },
  {
    name: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 14.5,
    badge: '省50%',
  },
];

export default function PricingCards() {
  const [isYearly, setIsYearly] = useState(false);

  const getValue = (tier: PricingTier): string => {
    if (tier.isFree) return '免费';
    const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
    return `$${price}/月`;
  };

  return (
    <div className="w-full">
      {/* Tab 切换 */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              !isYearly
                ? 'bg-violet-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            月付
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isYearly
                ? 'bg-violet-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            年付（按年计费）
          </button>
        </div>
      </div>

      {/* 定价卡片 - 4档产品横向排列 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl p-6 transition-all duration-300 ${
              tier.badge
                ? 'bg-gradient-to-b from-violet-600/20 to-purple-600/10 border-2 border-violet-500/50 shadow-xl shadow-violet-500/10'
                : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20'
            }`}
          >
            {/* 标签 */}
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  tier.badge === '最划算'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-violet-600 text-white'
                }`}>
                  {tier.badge}
                </span>
              </div>
            )}

            {/* 套餐名称 */}
            <h3 className="text-lg font-bold text-white mb-1">{tier.name}</h3>
            <p className="text-xs text-slate-500 mb-4">
              {isYearly ? '按年计费' : '月付'}
            </p>

            {/* 价格 */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">{getValue(tier)}</span>
            </div>

            {/* 功能列表 - 完整14项权益 */}
            <ul className="space-y-3 mb-6">
              {FULL_FEATURES.map((feature) => (
                <li key={feature.text} className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{feature.text}</span>
                  <span className={`font-medium ${
                    tier.isFree
                      ? feature.free?.startsWith('✅') ? 'text-emerald-400' : 'text-slate-300'
                      : feature.lite?.startsWith('✅') ? 'text-emerald-400' : 'text-slate-300'
                  }`}>
                    {tier.isFree ? feature.free : tier.name === 'Lite' ? feature.lite : feature.pro}
                  </span>
                </li>
              ))}
            </ul>

            {/* 按钮 */}
            {tier.isFree ? (
              <Link
                href="/api/auth/google"
                className="block w-full py-3 px-4 text-center border border-slate-600 hover:border-slate-500 text-slate-300 font-medium rounded-xl transition-all hover:bg-slate-800/50"
              >
                开始试用
              </Link>
            ) : (
              <button
                disabled
                className="w-full py-3 px-4 bg-slate-700/50 text-slate-500 font-medium rounded-xl cursor-not-allowed"
              >
                即将推出
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <p className="text-center text-sm text-slate-500 mt-8">
        所有价格均为美元。随时取消，无隐藏费用。
      </p>
    </div>
  );
}