const CACHE_KEY = 'towera_phrase_weights';

function readCache(): Record<string, number> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, number>): void {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function getCachedWeight(phraseId: number): number | undefined {
  return readCache()[String(phraseId)];
}

export function setCachedWeight(phraseId: number, weight: number): void {
  const cache = readCache();
  cache[String(phraseId)] = weight;
  writeCache(cache);
}
