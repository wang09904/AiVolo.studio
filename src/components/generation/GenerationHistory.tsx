'use client';

import { useEffect, useMemo, useState } from 'react';
import DownloadImageButton from '@/components/generation/DownloadImageButton';
import {
  readRecentGenerations,
  type RecentGeneration,
} from '@/lib/generation/recentGenerations';

export type GenerationHistoryRow = RecentGeneration & {
  storageKey?: string | null;
};

type GenerationHistoryProps = {
  serverRows?: GenerationHistoryRow[];
  errorMessage?: string | null;
};

function mergeGenerations(
  serverRows: GenerationHistoryRow[],
  recentRows: GenerationHistoryRow[]
): GenerationHistoryRow[] {
  const byId = new Map<string, GenerationHistoryRow>();

  for (const row of recentRows) {
    byId.set(row.id, row);
  }

  for (const row of serverRows) {
    const recent = byId.get(row.id);
    byId.set(row.id, {
      ...row,
      imageUrl: row.imageUrl || recent?.imageUrl || '',
      storageKey: row.storageKey || recent?.storageKey || null,
    });
  }

  return Array.from(byId.values())
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 12);
}

export default function GenerationHistory({
  serverRows = [],
  errorMessage,
}: GenerationHistoryProps) {
  const [recentRows, setRecentRows] = useState<GenerationHistoryRow[]>([]);

  useEffect(() => {
    setRecentRows(readRecentGenerations());
  }, []);

  const generationRows = useMemo(
    () => mergeGenerations(serverRows, recentRows),
    [serverRows, recentRows]
  );

  if (generationRows.length > 0) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        {generationRows.map((generation) => {
          const thumbnailUrl = generation.storageKey || !generation.imageUrl
            ? `/api/download/generation/${generation.id}?inline=1`
            : generation.imageUrl;

          return (
            <article
              key={generation.id}
              data-testid="history-item"
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-brand-border bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-bg">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="grid h-full place-items-center text-sm font-bold text-brand-muted">
                    No preview
                  </div>
                )}
              </div>
              <div className="flex flex-grow flex-col justify-between p-6">
                <p className="line-clamp-2 text-sm font-medium leading-relaxed text-brand-text">
                  {generation.prompt}
                </p>
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between gap-3 text-xs font-bold text-brand-muted">
                    <span className="rounded-full bg-brand-bg px-3 py-1 shadow-sm">{generation.modelId}</span>
                    <span className="rounded-full bg-brand-secondary px-3 py-1 text-brand-cta">{generation.creditsUsed} credits</span>
                  </div>
                  <DownloadImageButton
                    generationId={generation.id}
                    imageUrl={generation.imageUrl}
                    testId="history-download-link"
                    fileNamePrefix="aivolo"
                    className="flex w-full items-center justify-center rounded-2xl bg-white border-2 border-brand-border px-4 py-3 text-sm font-bold text-brand-text shadow-sm transition-transform duration-300 ease-out active:scale-95 hover:bg-brand-bg"
                  >
                    Download
                  </DownloadImageButton>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 text-sm font-bold text-red-600">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-brand-border bg-white p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-secondary text-2xl">🖼️</div>
      <p className="text-2xl font-bold tracking-tight text-brand-text">No History</p>
      <p className="mt-2 text-base font-medium text-brand-muted">Execute your first generation to see it here.</p>
    </div>
  );
}
