import { redis } from "./redis";

const TPM_LIMIT = 90000; // Tokens per minute limit for gpt-3.5-turbo
const RPM_LIMIT = 3500;  // Requests per minute limit for gpt-3.5-turbo

export class TokenTracker {
  private tpmKey: string;
  private rpmKey: string;

  constructor() {
    this.tpmKey = 'openai:tpm';
    this.rpmKey = 'openai:rpm';
  }

  async canMakeRequest(estimatedTokens: number): Promise<boolean> {
    try {
      const multi = redis.multi();
      multi.incrby(this.tpmKey, estimatedTokens);
      multi.incr(this.rpmKey);
      multi.pttl(this.tpmKey);
      
      const results = await multi.exec();
      if (!results) {
        console.error("Redis multi.exec() returned null");
        return false;
      }

      const [tpmCount, rpmCount, ttl] = results.map(result => {
        if (Array.isArray(result)) {
          return result[1];
        }
        return result;
      });

      if (typeof ttl === 'number' && ttl < 0) {
        await redis.multi()
          .set(this.tpmKey, estimatedTokens)
          .expire(this.tpmKey, 60)
          .set(this.rpmKey, 1)
          .expire(this.rpmKey, 60)
          .exec();
        return true;
      }

      if (Number(tpmCount) > TPM_LIMIT || Number(rpmCount) > RPM_LIMIT) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in canMakeRequest:", error);
      return false;
    }
  }

  async recordUsage(actualTokens: number, estimatedTokens: number): Promise<void> {
    try {
      await redis.incrby(this.tpmKey, actualTokens - estimatedTokens);
    } catch (error) {
      console.error("Error in recordUsage:", error);
    }
  }
}

export const tokenTracker = new TokenTracker();