'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ASPECT_RATIOS, TEXT_TO_IMAGE_MODEL } from '@/lib/product';
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
        setResult({
          imageUrl: data.generation.image_url,
          generationId: data.generation.id,
        });
        window.dispatchEvent(new Event('aivolo:credits-updated'));
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (generationId: string) => {
    const anchor = document.createElement('a');
    anchor.href = `/api/download/generation/${encodeURIComponent(generationId)}`;
    anchor.download = `aivolo-${Date.now()}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <main className="min-h-screen bg-[oklch(13%_0.016_270)] px-6 py-12 text-[oklch(96%_0.01_270)] lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[420px_1fr]">
        <section className="rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-5">
          <div className="mb-6">
            <p className="text-sm font-semibold text-[oklch(72%_0.18_270)]">Text to image</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">Create a new image</h1>
            <p className="mt-3 text-sm leading-6 text-[oklch(72%_0.018_270)]">
              Start with text-to-image generation today. Image-to-image, video, templates, and subscriptions are coming soon.
            </p>
          </div>

          <label htmlFor="prompt" className="text-sm font-medium text-[oklch(82%_0.018_270)]">
            Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="A cinematic thumbnail of a tiny robot cooking street food in Bangkok..."
            className="mt-3 h-40 w-full resize-none rounded-md border border-[oklch(31%_0.02_270)] bg-[oklch(12%_0.014_270)] px-4 py-3 text-[oklch(96%_0.01_270)] outline-none transition-colors placeholder:text-[oklch(52%_0.015_270)] focus:border-[oklch(72%_0.18_270)]"
            disabled={isGenerating}
          />

          <div className="mt-5">
            <p className="text-sm font-medium text-[oklch(82%_0.018_270)]">Model</p>
            <div className="mt-3 rounded-md border border-[oklch(31%_0.02_270)] bg-[oklch(12%_0.014_270)] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{TEXT_TO_IMAGE_MODEL.name}</p>
                  <p className="text-sm text-[oklch(68%_0.018_270)]">{TEXT_TO_IMAGE_MODEL.provider}</p>
                </div>
                <span className="rounded-full bg-[oklch(72%_0.18_270)] px-3 py-1 text-xs font-semibold text-[oklch(16%_0.03_270)]">
                  {TEXT_TO_IMAGE_MODEL.creditCost} credits
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-[oklch(82%_0.018_270)]">Aspect ratio</p>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  type="button"
                  onClick={() => setAspectRatio(ratio.value)}
                  disabled={isGenerating}
                  className={`min-h-16 rounded-md border px-2 text-xs font-semibold transition-colors ${
                    aspectRatio === ratio.value
                      ? 'border-[oklch(72%_0.18_270)] bg-[oklch(72%_0.18_270)] text-[oklch(16%_0.03_270)]'
                      : 'border-[oklch(31%_0.02_270)] bg-[oklch(12%_0.014_270)] text-[oklch(76%_0.018_270)] hover:border-[oklch(50%_0.04_270)]'
                  }`}
                >
                  {ratio.value}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[oklch(62%_0.016_270)]">
              {ASPECT_RATIOS.find((ratio) => ratio.value === aspectRatio)?.description}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="mt-6 w-full rounded-md bg-[oklch(72%_0.18_270)] px-5 py-3 text-sm font-semibold text-[oklch(16%_0.03_270)] transition-colors hover:bg-[oklch(68%_0.18_270)] disabled:cursor-not-allowed disabled:bg-[oklch(34%_0.02_270)] disabled:text-[oklch(62%_0.016_270)]"
          >
            {isGenerating ? 'Generating...' : `Generate image (${TEXT_TO_IMAGE_MODEL.creditCost} credits)`}
          </button>

          {error && (
            <div className="mt-4 rounded-md border border-[oklch(60%_0.16_25_/_0.45)] bg-[oklch(20%_0.04_25)] p-3 text-sm text-[oklch(82%_0.09_25)]">
              {error}
            </div>
          )}
        </section>

        <section className="min-h-[640px] rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(16%_0.012_270)] p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Result</h2>
              <p className="mt-1 text-sm text-[oklch(66%_0.016_270)]">
                Your generated image appears here when the job finishes.
              </p>
            </div>
            {result && (
              <span className="rounded-full border border-[oklch(31%_0.02_270)] px-3 py-1 text-xs text-[oklch(70%_0.018_270)]">
                {result.generationId.slice(0, 8)}
              </span>
            )}
          </div>

          {isGenerating ? (
            <div className="grid min-h-[520px] place-items-center rounded-md border border-[oklch(29%_0.018_270)] bg-[oklch(12%_0.014_270)]">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full border border-[oklch(72%_0.18_270)] bg-[oklch(20%_0.03_270)]" />
                <p className="mt-5 font-semibold">Building the image</p>
                <p className="mt-2 text-sm text-[oklch(66%_0.016_270)]">This can take a short moment.</p>
              </div>
            </div>
          ) : result ? (
            <div>
              <div className="overflow-hidden rounded-md border border-[oklch(29%_0.018_270)] bg-[oklch(12%_0.014_270)]">
                <img src={result.imageUrl} alt="Generated result" className="h-auto w-full" />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleDownload(result.generationId)}
                  className="rounded-md bg-[oklch(72%_0.18_145)] px-4 py-3 text-sm font-semibold text-[oklch(14%_0.03_145)] transition-colors hover:bg-[oklch(68%_0.18_145)]"
                >
                  Download image
                </button>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="rounded-md border border-[oklch(35%_0.02_270)] px-4 py-3 text-sm font-semibold text-[oklch(88%_0.012_270)] transition-colors hover:border-[oklch(72%_0.18_270)]"
                >
                  Create another
                </button>
              </div>
            </div>
          ) : (
            <div className="grid min-h-[520px] place-items-center rounded-md border border-dashed border-[oklch(34%_0.02_270)] bg-[oklch(12%_0.014_270)] p-8 text-center">
              <div>
                <p className="text-2xl font-semibold text-[oklch(90%_0.012_270)]">No image yet</p>
                <p className="mt-3 max-w-md text-sm leading-6 text-[oklch(66%_0.016_270)]">
                  Enter a prompt on the left, then generate. If you are not signed in, Google login opens at that moment.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[oklch(8%_0.012_270_/_0.78)] p-4">
          <div className="w-full max-w-md rounded-lg border border-[oklch(31%_0.02_270)] bg-[oklch(17%_0.012_270)] p-6">
            <h3 className="text-xl font-semibold">Sign in to generate</h3>
            <p className="mt-3 text-sm leading-6 text-[oklch(72%_0.018_270)]">
              Browsing and writing prompts stay open to everyone. Generation uses credits, so Google login is required at this step.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="flex-1 rounded-md border border-[oklch(35%_0.02_270)] px-4 py-3 text-sm font-semibold text-[oklch(88%_0.012_270)]"
              >
                Cancel
              </button>
              <a
                href={loginHref}
                className="flex-1 rounded-md bg-[oklch(72%_0.18_270)] px-4 py-3 text-center text-sm font-semibold text-[oklch(16%_0.03_270)]"
              >
                Continue with Google
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
