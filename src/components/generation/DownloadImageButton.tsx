'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

type DownloadImageButtonProps = {
  generationId: string;
  imageUrl?: string | null;
  className?: string;
  children?: ReactNode;
  fileNamePrefix?: string;
  testId?: string;
  onError?: (message: string) => void;
};

function extensionFromContentType(contentType: string | null) {
  if (!contentType) return 'png';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';
  if (contentType.includes('webp')) return 'webp';
  return 'png';
}

export default function DownloadImageButton({
  generationId,
  className,
  children = 'Download',
  fileNamePrefix = 'aivolo',
  testId = 'download-image-button',
  onError,
}: DownloadImageButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setLocalError(null);

    try {
      const extension = extensionFromContentType(null);
      const anchor = document.createElement('a');
      anchor.href = `/api/download/generation/${encodeURIComponent(generationId)}`;
      anchor.download = `${fileNamePrefix}-${generationId.slice(0, 8)}.${extension}`;
      anchor.rel = 'noopener';
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
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
      <button
        data-testid={testId}
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className={className}
      >
        {isDownloading ? 'Preparing download...' : children}
      </button>
      {localError && !onError && (
        <p data-testid="download-error" className="mt-2 text-sm text-[oklch(76%_0.12_25)]">{localError}</p>
      )}
    </div>
  );
}
