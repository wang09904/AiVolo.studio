'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

type DownloadImageButtonProps = {
  generationId: string;
  className?: string;
  children?: ReactNode;
  fileNamePrefix?: string;
  onError?: (message: string) => void;
};

function extensionFromContentType(contentType: string | null) {
  if (!contentType) return 'png';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';
  if (contentType.includes('webp')) return 'webp';
  return 'png';
}

async function readDownloadError(response: Response) {
  try {
    const data = await response.clone().json();
    if (typeof data?.error === 'string' && data.error.trim()) return data.error;
  } catch {
    // Fall back to a status-based message below.
  }

  if (response.status === 401) return 'Please sign in first.';
  if (response.status === 404) return 'Generated image not found.';
  if (response.status === 410) return 'This generated image link has expired.';
  return `Download failed with status ${response.status}.`;
}

export default function DownloadImageButton({
  generationId,
  className,
  children = 'Download',
  fileNamePrefix = 'aivolo',
  onError,
}: DownloadImageButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setLocalError(null);

    try {
      const response = await fetch(`/api/download/generation/${encodeURIComponent(generationId)}`);

      if (!response.ok) {
        throw new Error(await readDownloadError(response));
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Downloaded image was empty.');
      }

      const extension = extensionFromContentType(response.headers.get('content-type'));
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `${fileNamePrefix}-${generationId.slice(0, 8)}.${extension}`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Download failed. Please try again.';
      setLocalError(message);
      onError?.(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={handleDownload} disabled={isDownloading} className={className}>
        {isDownloading ? 'Preparing download...' : children}
      </button>
      {localError && !onError && (
        <p className="mt-2 text-sm text-[oklch(76%_0.12_25)]">{localError}</p>
      )}
    </div>
  );
}
