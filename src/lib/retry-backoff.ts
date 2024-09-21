const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // Start with a 2-second delay and increase exponentially

export async function retryWithBackoff(fn: () => Promise<any>, retries = MAX_RETRIES, delay = RETRY_DELAY) {
  try {
    return await fn();
  } catch (error: any) {
    if (error.status === 429 && retries > 0) {
      console.log(`Rate limit hit, retrying in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2); // Exponential backoff
    }
    throw error; // If not a rate limit error or no retries left, throw the error
  }
}
