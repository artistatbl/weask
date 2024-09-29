import { upstash, openai } from "@upstash/rag-chat";
import { redis } from "./redis";

function getMaxTokens(query: string): number {
  // Adjust token allocation based on typical query lengths and complexity
  if (query.length > 100) {
    return 300; // Reduced from 400
  }
  return 150; // Reduced from 200
}

export const ragConfig = (query: string) => ({
  model: upstash("mistralai/Mistral-7B-Instruct-v0.2"),

  redis: redis,
  retrievalOptions: {
    topK: 2, // Reduce from 5 to 3 to limit context size
    minScore: 0.75,
  },
  modelOptions: {
    max_tokens: getMaxTokens(query), // Dynamic token allocation
    temperature: 0.7,
  },
});