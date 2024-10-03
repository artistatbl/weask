const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // Start with a 1-second delay

interface RetryError extends Error {
  status?: number;
  headers?: {
    'retry-after'?: string;
  };
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = INITIAL_RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const retryError = error as RetryError;
    if (retryError.status === 429 && retries > 0) {
      const retryAfter = retryError.headers?.['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay;
      console.log(`Rate limit hit, retrying in ${waitTime / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return retryWithBackoff(fn, retries - 1, Math.min(delay * 2, 60000)); // Exponential backoff, max 1 minute
    }
    throw error; // If not a rate limit error or no retries left, throw the error
  }
}
