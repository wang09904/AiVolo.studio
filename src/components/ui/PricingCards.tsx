'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PricingTier {
  name: string;
  price: number;
  credits: number;
  storage: string;
  features: string[];
  isPopular?: boolean;
  isDisabled?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Free',
    price: 0,
    credits: 20,
    storage: '7天',
    features: ['文生图', '基础模型', '社区支持'],
  },
  {
    name: 'Lite',
    price: 9.9,
    credits: 200,
    storage: '30天',
    features: ['文生图 + 图生图', '全部模型', '优先生成', '邮件支持'],
    isPopular: true,
  },
  {
    name: 'Pro',
    price: 29.9,
    credits: 800,
    storage: '1年',
    features: ['视频生成', '全部模型', '极速生成', '专属客服', 'API访问'],
  },
  {
    name: 'Enterprise',
    price: 99,
    credits: Infinity,
    storage: '1年',
    features: ['无限积分', '私有部署', 'SLA保障', '专属经理', '定制模型'],
  },
];

export default function PricingCards() {
  const [isYearly, setIsYearly] = useState(false);

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
            年付
            <span className="ml-2 text-xs text-emerald-400">省20%</span>
          </button>
        </div>
      </div>

      {/* 定价卡片 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl p-6 transition-all duration-300 ${
              tier.isPopular
                ? 'bg-gradient-to-b from-violet-600/20 to-purple-600/10 border-2 border-violet-500/50 shadow-xl shadow-violet-500/10'
                : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20'
            }`}
          >
            {/* 热门标签 */}
            {tier.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-violet-600 text-white text-xs font-semibold rounded-full">
                  最受欢迎
                </span>
              </div>
            )}

            {/* 套餐名称 */}
            <h3 className="text-lg font-bold text-white mb-2">{tier.name}</h3>

            {/* 价格 */}
            <div className="mb-4">
              {tier.price === 0 ? (
                <span className="text-3xl font-bold text-white">免费</span>
              ) : (
                <>
                  <span className="text-3xl font-bold text-white">
                    {isYearly ? (tier.price * 0.8).toFixed(1) : tier.price}€
                  </span>
                  <span className="text-slate-400 text-sm">/月</span>
                  {isYearly && (
                    <p className="text-xs text-slate-500 mt-1">
                      原价 {tier.price}€/月，年付{' '}
                      {tier.price * 12 * 0.8}€
                    </p>
                  )}
                </>
              )}
            </div>

            {/* 积分和存储 */}
            <div className="flex items-baseline gap-2 mb-4 pb-4 border-b border-slate-700/50">
              <span className="text-xl font-bold text-violet-400">
                {tier.credits === Infinity ? '∞' : tier.credits}
              </span>
              <span className="text-sm text-slate-400">积分</span>
              <span className="mx-2 text-slate-600">|</span>
              <span className="text-sm text-slate-400">{tier.storage}存储</span>
            </div>

            {/* 功能列表 */}
            <ul className="space-y-3 mb-6">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                  <svg
                    className="w-4 h-4 text-emerald-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* 按钮 */}
            {tier.isDisabled ? (
              <button
                disabled
                className="w-full py-3 px-4 bg-slate-700/50 text-slate-500 font-medium rounded-xl cursor-not-allowed"
              >
                即将推出
              </button>
            ) : tier.price === 0 ? (
              <Link
                href="/api/auth/google"
                className="block w-full py-3 px-4 text-center border border-slate-600 hover:border-slate-500 text-slate-300 font-medium rounded-xl transition-all hover:bg-slate-800/50"
              >
                开始试用
              </Link>
            ) : (
              <button className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40">
                立即订阅
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <p className="text-center text-sm text-slate-500 mt-8">
        所有价格均为欧元，不含 VAT。随时取消，无隐藏费用。
      </p>
    </div>
  );
}