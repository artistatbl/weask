import { createHash } from 'crypto';

interface EmbeddabilityResult {
  embeddable: boolean;
  message: string;
  timestamp: number;
}

const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_ENTRIES = 20;

export function getEmbeddabilityResult(url: string): EmbeddabilityResult | null {
  const key = createUrlHash(url);
  const storedItem = localStorage.getItem(key);
  
  if (storedItem) {
    const result: EmbeddabilityResult = JSON.parse(storedItem);
    if (Date.now() - result.timestamp < CACHE_EXPIRATION) {
      return result;
    } else {
      localStorage.removeItem(key);
    }
  }
  
  return null;
}

export function setEmbeddabilityResult(url: string, result: Omit<EmbeddabilityResult, 'timestamp'>): void {
  const key = createUrlHash(url);
  const entry: EmbeddabilityResult = {
    ...result,
    timestamp: Date.now(),
  };
  
  localStorage.setItem(key, JSON.stringify(entry));
  cleanupCache();
}

function createUrlHash(url: string): string {
  return createHash('md5').update(url).digest('hex');
}

function cleanupCache(): void {
  const keys = Object.keys(localStorage);
  const embeddabilityKeys = keys.filter(key => key.startsWith('embeddability_'));
  
  if (embeddabilityKeys.length > MAX_CACHE_ENTRIES) {
    const sortedKeys = embeddabilityKeys
      .map(key => ({ key, timestamp: JSON.parse(localStorage.getItem(key) || '{}').timestamp || 0 }))
      .sort((a, b) => b.timestamp - a.timestamp);
    
    sortedKeys.slice(MAX_CACHE_ENTRIES).forEach(({ key }) => localStorage.removeItem(key));
  }
}


