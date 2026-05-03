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
              className="group relative flex flex-col border border-brand-border bg-transparent transition-colors hover:border-brand-cta/50"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-surface/30">
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt="" className="h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" />
                ) : (
                  <div className="grid h-full place-items-center text-xs font-medium uppercase tracking-widest text-brand-muted">
                    No preview
                  </div>
                )}
              </div>
              <div className="flex flex-grow flex-col justify-between p-6">
                <p className="line-clamp-2 text-sm leading-relaxed text-brand-text">
                  {generation.prompt}
                </p>
                <div className="mt-8">
                  <div className="mb-6 flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-widest text-brand-muted">
                    <span>{generation.modelId}</span>
                    <span className="text-brand-cta">{generation.creditsUsed} credits</span>
                  </div>
                  <DownloadImageButton
                    generationId={generation.id}
                    imageUrl={generation.imageUrl}
                    testId="history-download-link"
                    fileNamePrefix="aivolo"
                    className="flex w-full items-center justify-center border border-brand-border bg-transparent px-4 py-3 text-xs font-medium uppercase tracking-widest text-brand-muted transition-all duration-300 hover:border-brand-text hover:text-brand-text active:scale-[0.98]"
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
      <div className="border-l-2 border-red-500 bg-red-500/10 p-6 text-sm font-medium text-red-400">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center border border-dashed border-brand-border p-12 text-center">
      <div className="mb-6 h-px w-12 bg-brand-border"></div>
      <p className="text-2xl font-light tracking-tight text-brand-text">No History</p>
      <p className="mt-3 text-sm text-brand-muted">Execute your first generation to see it here.</p>
    </div>
  );
}
