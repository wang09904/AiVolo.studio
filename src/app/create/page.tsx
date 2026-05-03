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
    <main className="min-h-[100dvh] bg-brand-bg px-6 py-12 text-brand-text lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1600px]">
        {/* Header Area */}
        <div className="mb-12 border-b border-brand-border pb-8">
           <h1 className="text-4xl font-light tracking-tighter md:text-5xl text-brand-text">Generation Workspace</h1>
        </div>

        <div className="grid gap-16 lg:grid-cols-[400px_1fr] xl:grid-cols-[480px_1fr]">

          {/* Left Panel: Configuration */}
          <section className="flex flex-col gap-10">
            {/* Prompt */}
            <div className="flex flex-col gap-4">
              <label htmlFor="prompt" className="text-sm font-medium tracking-wide text-brand-muted">
                01. Core Directive
              </label>
              <textarea
                data-testid="create-prompt-input"
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="A cinematic thumbnail..."
                className="h-48 w-full resize-none rounded-md border border-brand-border bg-brand-surface/50 px-5 py-5 text-xl font-light leading-relaxed text-brand-text outline-none transition-all placeholder:text-zinc-600 focus:border-brand-cta focus:bg-brand-surface focus:ring-1 focus:ring-brand-cta/50"
                disabled={isGenerating}
              />
            </div>

            {/* Model & Ratio Group */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex flex-col gap-4">
                <label htmlFor="model" className="text-sm font-medium tracking-wide text-brand-muted">
                  02. Model
                </label>
                <select
                  id="model"
                  defaultValue={TEXT_TO_IMAGE_MODEL.id}
                  disabled={isGenerating}
                  className="w-full cursor-pointer appearance-none rounded-md border border-brand-border bg-brand-surface/50 px-4 py-4 text-base font-medium text-brand-text focus:border-brand-cta focus:bg-brand-surface focus:outline-none focus:ring-1 focus:ring-brand-cta/50 transition-all disabled:opacity-50"
                >
                  <option value={TEXT_TO_IMAGE_MODEL.id} className="bg-brand-surface">
                    {TEXT_TO_IMAGE_MODEL.name} ({TEXT_TO_IMAGE_MODEL.creditCost} credits)
                  </option>
                </select>
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium tracking-wide text-brand-muted">03. Aspect Ratio</label>
                <div className="grid grid-cols-5 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      data-testid={`aspect-ratio-${ratio.value}`}
                      key={ratio.value}
                      type="button"
                      onClick={() => setAspectRatio(ratio.value)}
                      disabled={isGenerating}
                      className={`flex h-14 items-center justify-center rounded-md border text-xs font-medium transition-all duration-300 ${
                        aspectRatio === ratio.value
                          ? 'border-brand-text bg-brand-text text-brand-bg shadow-lg'
                          : 'border-brand-border bg-brand-surface/40 text-brand-muted hover:border-brand-muted hover:text-brand-text hover:bg-brand-surface'
                      }`}
                    >
                      {ratio.value}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              data-testid="generate-image-button"
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="mt-8 flex w-full items-center justify-between rounded-md bg-brand-cta px-6 py-5 text-sm font-medium text-white transition-all duration-300 ease-out active:scale-[0.98] hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-brand-surface disabled:text-brand-muted"
            >
              <span>{isGenerating ? 'Executing...' : 'Execute Generation'}</span>
              {!isGenerating && <span>{TEXT_TO_IMAGE_MODEL.creditCost} Credits</span>}
            </button>

            {error && (
              <div
                data-testid="generation-error"
                className="mt-4 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {error}
              </div>
            )}
          </section>

          {/* Right Panel: Result */}
          <section className="relative flex min-h-[600px] flex-col overflow-hidden rounded-xl border border-brand-border bg-brand-surface/30 shadow-2xl">
            {isGenerating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-bg/50 backdrop-blur-sm">
                <div className="mb-8 h-px w-32 overflow-hidden bg-brand-border">
                  <div className="h-full w-full animate-pulse bg-brand-cta"></div>
                </div>
                <p className="font-light tracking-widest text-brand-muted uppercase text-xs">Processing sequence</p>
              </div>
            ) : result ? (
              <div data-testid="generation-result" className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-brand-border bg-brand-bg px-6 py-4">
                  <span className="text-xs font-mono tracking-widest text-brand-muted">ID: {result.generationId.slice(0, 8)}</span>
                  <div className="flex gap-4">
                    <button
                      data-testid="create-another-button"
                      type="button"
                      onClick={() => setResult(null)}
                      className="text-xs font-medium uppercase tracking-widest text-brand-muted transition-colors hover:text-brand-text"
                    >
                      Clear
                    </button>
                    <DownloadImageButton
                      generationId={result.generationId}
                      imageUrl={result.imageUrl}
                      onError={setError}
                      className="text-xs font-medium uppercase tracking-widest text-brand-cta transition-colors hover:text-blue-400"
                    >
                      Download
                    </DownloadImageButton>
                  </div>
                </div>
                <div className="flex-grow p-6">
                  <img data-testid="generated-image" src={result.imageUrl} alt="Generated result" className="h-full w-full object-contain" />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                 <div className="mb-6 h-px w-16 bg-brand-border"></div>
                 <p className="text-2xl font-light tracking-tight text-brand-text">Standby</p>
                 <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-brand-muted">
                   Configure parameters on the left and execute to generate an image. Ensure you have sufficient credits.
                 </p>
              </div>
            )}
          </section>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg/90 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md border border-brand-border bg-brand-bg p-8 shadow-2xl">
              <h3 className="text-2xl font-light tracking-tight text-brand-text">Authentication Required</h3>
              <p className="mt-4 text-sm leading-relaxed text-brand-muted">
                Generation consumes credits. Please sign in to proceed.
              </p>
              <div className="mt-10 flex flex-col gap-4">
                <a
                  href={loginHref}
                  className="flex w-full items-center justify-center bg-brand-text px-6 py-4 text-sm font-medium text-brand-bg transition-all duration-300 active:scale-[0.98] hover:bg-white"
                >
                  Continue with Google
                </a>
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="flex w-full items-center justify-center border border-brand-border px-6 py-4 text-sm font-medium text-brand-muted transition-all hover:text-brand-text"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
