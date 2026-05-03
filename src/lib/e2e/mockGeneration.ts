export type E2EMockGeneration = {
  id: string;
  prompt: string;
  imageUrl: string;
  modelId: string;
  creditsUsed: number;
  createdAt: string;
};

export const E2E_MOCK_GENERATION_HISTORY_KEY = 'aivolo:e2e:generation-history';
export const E2E_MOCK_IMAGE_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/l5rP6wAAAABJRU5ErkJggg==';
export const E2E_MOCK_IMAGE_DATA_URL = `data:image/png;base64,${E2E_MOCK_IMAGE_BASE64}`;

export function isE2EMockMode() {
  return process.env.AIVOLO_E2E_MOCKS === '1' || process.env.NEXT_PUBLIC_AIVOLO_E2E_MOCKS === '1';
}

export function readE2EMockGenerations(): E2EMockGeneration[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(E2E_MOCK_GENERATION_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveE2EMockGeneration(generation: E2EMockGeneration) {
  if (typeof window === 'undefined') return;

  const current = readE2EMockGenerations();
  const withoutDuplicate = current.filter((item) => item.id !== generation.id);
  window.localStorage.setItem(
    E2E_MOCK_GENERATION_HISTORY_KEY,
    JSON.stringify([generation, ...withoutDuplicate].slice(0, 12))
  );
}
