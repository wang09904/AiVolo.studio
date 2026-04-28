'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AspectRatio, TextToImageResponse } from '@/types/generation';
import PricingCards from '@/components/ui/PricingCards';

const ASPECT_RATIOS: { value: AspectRatio; label: string; icon: string }[] = [
  { value: '1:1', label: '1:1', icon: '◇' },
  { value: '16:9', label: '16:9', icon: '▭' },
  { value: '9:16', label: '9:16', icon: '▯' },
  { value: '4:3', label: '4:3', icon: '▬' },
  { value: '3:4', label: '3:4', icon: '▮' },
];

const MODELS = [
  { id: 'gpt-image-2', name: 'GPT Image 2', provider: 'OpenAI', badge: '最强' },
  { value: 'dall-e-3', name: 'DALL-E 3', provider: 'OpenAI', badge: null },
];

const DEFAULT_MODEL = 'gpt-image-2';
const DEFAULT_ASPECT: AspectRatio = '1:1';

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [modelId] = useState(DEFAULT_MODEL);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(DEFAULT_ASPECT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ imageUrl: string; generationId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    // 未登录时弹出登录提示
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model_id: modelId,
          aspect_ratio: aspectRatio,
        }),
      });

      const data: TextToImageResponse = await response.json();

      if (!data.success) {
        setError(data.error || '生成失败');
        return;
      }

      if (data.generation) {
        setResult({
          imageUrl: data.generation.image_url,
          generationId: data.generation.id,
        });
      }
    } catch (err) {
      console.error('生成错误:', err);
      setError('网络错误，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aivolo-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('下载失败:', err);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        {/* 主渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-950 to-slate-950" />
        {/* 装饰圆形 */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl" />
        {/* 网格纹理 */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-5xl pt-16 pb-20">
        {/* Hero 区域 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-sm text-violet-300 mb-6">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            新用户首月 20 积分免费体验
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            AI 图片生成
            <span className="block mt-2 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              简单、酷炫、便宜
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            输入描述词，选择模型和比例，几秒内生成专业级图片
          </p>
        </div>

        {/* 生成表单 */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 mb-16 shadow-2xl shadow-violet-950/20">
          {/* 提示词输入 */}
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
              描述你想要生成的图片
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="例如：一只穿着太空服的猫咪在火星上自拍，赛博朋克风格..."
              className="w-full h-28 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition-all"
              disabled={isGenerating}
            />
          </div>

          {/* 模型和比例选择 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* 模型选择 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                选择模型
              </label>
              <div className="space-y-2">
                {MODELS.map((model) => (
                  <div
                    key={model.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      modelId === model.id
                        ? 'bg-violet-500/10 border-violet-500/50'
                        : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {model.provider.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{model.name}</p>
                        <p className="text-xs text-slate-400">{model.provider}</p>
                      </div>
                    </div>
                    {model.badge && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded">
                        {model.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 比例选择 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                图片比例
              </label>
              <div className="grid grid-cols-5 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => setAspectRatio(ratio.value)}
                    disabled={isGenerating}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg border transition-all ${
                      aspectRatio === ratio.value
                        ? 'bg-violet-500 border-violet-500 text-white'
                        : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-lg mb-0.5">{ratio.icon}</span>
                    <span className="text-xs font-medium">{ratio.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {aspectRatio === '1:1' && '适合社交媒体头像'}
                {aspectRatio === '16:9' && '适合横版Banner'}
                {aspectRatio === '9:16' && '适合Instagram故事'}
                {aspectRatio === '4:3' && '适合博客配图'}
                {aspectRatio === '3:4' && '适合Portrait摄影'}
              </p>
            </div>
          </div>

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-[0.98]"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                生成中...
              </span>
            ) : (
              '生成图片 (10积分)'
            )}
          </button>

          {/* 错误提示 */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* 登录提示弹窗 */}
          {showLoginModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowLoginModal(false)}
              />
              <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-2">登录后即可生成图片</h3>
                <p className="text-slate-400 text-sm mb-6">
                  登录账户后即可使用 AI 图片生成功能，新用户首月赠送 20 积分。
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 py-3 px-4 border border-slate-600 hover:border-slate-500 text-slate-300 font-medium rounded-xl transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                          redirectTo: `${window.location.origin}/create`,
                        },
                      });
                    }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/25"
                  >
                    使用 Google 登录
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 结果展示 */}
        {result && (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 md:p-8 mb-16 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white">生成结果</h2>
              <span className="text-xs text-slate-500">ID: {result.generationId.slice(0, 8)}</span>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-slate-800/50">
              <img
                src={result.imageUrl}
                alt="Generated image"
                className="w-full h-auto"
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleDownload(result.imageUrl)}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载图片
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setPrompt('');
                }}
                className="flex-1 py-3 px-4 border border-slate-600 hover:border-slate-500 text-slate-300 font-medium rounded-xl transition-colors"
              >
                继续生成
              </button>
            </div>
          </div>
        )}

        {/* 定价卡片区域 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            选择适合您的计划
          </h2>
          <PricingCards />
        </div>
      </div>
    </main>
  );
}