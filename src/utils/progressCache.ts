// src/utils/progressCache.ts

const progressCache = new Map<string, number>();

export function setProgress(jobId: string, progress: number) {
  progressCache.set(jobId, progress);
}

export function getProgress(jobId: string): number {
  return progressCache.get(jobId) || 0;
}

export function clearProgress(jobId: string) {
  progressCache.delete(jobId);
}