export type RecentGeneration = {
  id: string;
  prompt: string;
  imageUrl: string;
  modelId: string;
  creditsUsed: number;
  createdAt: string;
};

const RECENT_GENERATIONS_KEY = 'aivolo:recent-generations';

function isRecentGeneration(value: unknown): value is RecentGeneration {
  if (!value || typeof value !== 'object') return false;

  const generation = value as Record<string, unknown>;
  return (
    typeof generation.id === 'string' &&
    typeof generation.prompt === 'string' &&
    typeof generation.imageUrl === 'string' &&
    typeof generation.modelId === 'string' &&
    typeof generation.creditsUsed === 'number' &&
    typeof generation.createdAt === 'string'
  );
}

export function readRecentGenerations(): RecentGeneration[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(RECENT_GENERATIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isRecentGeneration) : [];
  } catch {
    return [];
  }
}

export function saveRecentGeneration(generation: RecentGeneration) {
  if (typeof window === 'undefined') return;

  const current = readRecentGenerations();
  const withoutDuplicate = current.filter((item) => item.id !== generation.id);
  window.localStorage.setItem(
    RECENT_GENERATIONS_KEY,
    JSON.stringify([generation, ...withoutDuplicate].slice(0, 12))
  );
}
