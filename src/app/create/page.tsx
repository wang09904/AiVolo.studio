'use client';

import { useEffect, useMemo, useState } from 'react';
import DownloadImageButton from '@/components/generation/DownloadImageButton';
import { createClient } from '@/lib/supabase/client';
import { ASPECT_RATIOS, TEXT_TO_IMAGE_MODEL } from '@/lib/product';
import { isE2EMockMode } from '@/lib/e2e/mockGeneration';
import { saveRecentGeneration } from '@/lib/generation/recentGenerations';
import type { AspectRatio, TextToImageResponse } from '@/types/generation';

const DEFAULT_ASPECT: AspectRatio = '1:1';

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(DEFAULT_ASPECT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ imageUrl: string; generationId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const loginHref = useMemo(() => {
    const params = new URLSearchParams();
    if (prompt.trim()) params.set('prompt', prompt.trim());
    params.set('aspect_ratio', aspectRatio);
    return `/api/auth/google?next=${encodeURIComponent(`/create?${params.toString()}`)}`;
  }, [prompt, aspectRatio]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const promptFromUrl = params.get('prompt');
    const aspectFromUrl = params.get('aspect_ratio') as AspectRatio | null;

    if (promptFromUrl) setPrompt(promptFromUrl);
    if (aspectFromUrl && ASPECT_RATIOS.some((ratio) => ratio.value === aspectFromUrl)) {
      setAspectRatio(aspectFromUrl);
    }

    if (isE2EMockMode()) {
      setIsLoggedIn(true);
      return;
    }

    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(Boolean(user));
    };

    checkAuth();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Describe the image you want to generate.');
      return;
    }

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
          model_id: TEXT_TO_IMAGE_MODEL.id,
          aspect_ratio: aspectRatio,
        }),
      });

      const data: TextToImageResponse = await response.json();

      if (response.status === 401) {
        setIsLoggedIn(false);
        setShowLoginModal(true);
        return;
      }

      if (!response.ok || !data.success) {
        window.dispatchEvent(new Event('aivolo:credits-updated'));
        setError(data.error || 'Generation failed. Please try again.');
        return;
      }

      if (data.generation) {
        const recentGeneration = {
          id: data.generation.id,
          prompt: prompt.trim(),
          imageUrl: data.generation.image_url,
          modelId: TEXT_TO_IMAGE_MODEL.id,
          creditsUsed: TEXT_TO_IMAGE_MODEL.creditCost,
          createdAt: new Date().toISOString(),
        };

        setResult({
          imageUrl: recentGeneration.imageUrl,
          generationId: recentGeneration.id,
        });
        saveRecentGeneration(recentGeneration);
        window.dispatchEvent(new Event('aivolo:credits-updated'));
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-brand-bg px-6 py-6 text-brand-text lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header Area */}
        <div className="mb-6 text-center lg:text-left">
           <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-brand-text">Creation Studio</h1>
           <p className="mt-1 text-base text-brand-muted">Turn your ideas into visual assets instantly.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr] xl:grid-cols-[460px_1fr]">

          {/* Left Panel: Configuration (Bento Card) */}
          <section className="flex flex-col gap-5 rounded-[2rem] border border-brand-border bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] lg:p-8">
            {/* Prompt */}
            <div className="flex flex-col gap-2">
              <label htmlFor="prompt" className="text-sm font-bold text-brand-text">
                What do you want to create?
              </label>
              <textarea
                data-testid="create-prompt-input"
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="A cinematic thumbnail..."
                className="h-28 w-full resize-none rounded-2xl border-2 border-brand-border bg-brand-bg px-4 py-3 text-base font-medium leading-relaxed text-brand-text outline-none transition-all placeholder:text-brand-muted focus:border-brand-cta focus:bg-white focus:ring-4 focus:ring-brand-cta/20"
                disabled={isGenerating}
              />
            </div>

            {/* Model Selection */}
            <div className="flex flex-col gap-2">
              <label htmlFor="model" className="text-sm font-bold text-brand-text">
                Model
              </label>
              <select
                id="model"
                defaultValue={TEXT_TO_IMAGE_MODEL.id}
                disabled={isGenerating}
                className="w-full cursor-pointer appearance-none rounded-xl border-2 border-brand-border bg-brand-bg px-4 py-3 text-sm font-bold text-brand-text focus:border-brand-cta focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-cta/20 transition-all disabled:opacity-50"
              >
                <option value={TEXT_TO_IMAGE_MODEL.id}>
                  {TEXT_TO_IMAGE_MODEL.name} ({TEXT_TO_IMAGE_MODEL.creditCost} credits)
                </option>
              </select>
            </div>

            {/* Aspect Ratio */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-brand-text">Aspect Ratio</label>
              <div className="grid grid-cols-5 gap-1.5">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    data-testid={`aspect-ratio-${ratio.value}`}
                    key={ratio.value}
                    type="button"
                    onClick={() => setAspectRatio(ratio.value)}
                    disabled={isGenerating}
                    className={`flex h-10 items-center justify-center rounded-xl border-2 text-xs font-bold transition-all duration-300 ease-out active:scale-95 ${
                      aspectRatio === ratio.value
                        ? 'border-brand-cta bg-brand-cta text-white shadow-sm'
                        : 'border-transparent bg-brand-secondary/50 text-brand-cta hover:bg-brand-secondary'
                    }`}
                  >
                    {ratio.value}
                  </button>
                ))}
              </div>
            </div>

            <button
              data-testid="generate-image-button"
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-brand-text px-5 py-3.5 text-base font-bold text-white transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-text/90 shadow-md disabled:cursor-not-allowed disabled:bg-brand-border disabled:text-brand-muted disabled:shadow-none"
            >
              <span>{isGenerating ? 'Creating magic...' : `Generate (${TEXT_TO_IMAGE_MODEL.creditCost} Credits)`}</span>
            </button>

            {error && (
              <div
                data-testid="generation-error"
                className="mt-1 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600"
              >
                {error}
              </div>
            )}
          </section>

          {/* Right Panel: Result (Floating Frame) */}
          <section className="relative flex min-h-[400px] flex-col overflow-hidden rounded-[2rem] border border-brand-border bg-white shadow-[0_10px_40px_rgb(0,0,0,0.05)]">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute h-full w-full animate-ping rounded-full bg-brand-cta/20"></div>
                  <div className="h-8 w-8 rounded-full bg-brand-cta shadow-[0_0_15px_rgb(124,36,237,0.4)]"></div>
                </div>
                <p className="mt-6 text-lg font-bold text-brand-text">Working on it...</p>
                <p className="mt-1 text-sm text-brand-muted font-medium">Sprinkling some AI dust.</p>
              </div>
            ) : result ? (
              <div data-testid="generation-result" className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-brand-border bg-white px-6 py-3">
                  <span className="rounded-full bg-brand-bg px-3 py-1 text-[10px] font-bold text-brand-muted">ID: {result.generationId.slice(0, 8)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      data-testid="create-another-button"
                      type="button"
                      onClick={() => setResult(null)}
                      className="rounded-full bg-brand-bg px-4 py-2 text-xs font-bold text-brand-text transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-border"
                    >
                      Clear
                    </button>
                    <DownloadImageButton
                      generationId={result.generationId}
                      imageUrl={result.imageUrl}
                      onError={setError}
                      className="rounded-full bg-brand-cta px-4 py-2 text-xs font-bold text-white transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-cta/90 shadow-sm"
                    >
                      Download
                    </DownloadImageButton>
                  </div>
                </div>
                <div className="flex-grow bg-brand-bg/50 p-6 flex items-center justify-center">
                  <div className="overflow-hidden rounded-xl shadow-md">
                    <img data-testid="generated-image" src={result.imageUrl} alt="Generated result" className="h-auto max-h-[50vh] w-auto object-contain" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-bg/30 p-8 text-center">
                 <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-secondary text-2xl">✨</div>
                 <p className="text-2xl font-bold text-brand-text">Waiting for your prompt</p>
                 <p className="mt-2 max-w-[35ch] text-sm text-brand-muted">
                   Type what you want to see on the left. The more details, the better the result.
                 </p>
              </div>
            )}
          </section>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-text/20 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgb(0,0,0,0.1)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary text-xl">👋</div>
              <h3 className="text-2xl font-bold text-brand-text">Sign In Required</h3>
              <p className="mt-2 text-sm text-brand-muted">
                Creating visuals uses credits. Please sign in to securely manage your balance and history.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={loginHref}
                  className="flex w-full items-center justify-center rounded-xl bg-brand-cta px-5 py-4 text-sm font-bold text-white shadow-md transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-cta/90"
                >
                  Continue with Google
                </a>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-brand-bg px-5 py-4 text-sm font-bold text-brand-text transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-border"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );  }
