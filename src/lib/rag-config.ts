import { upstash, openai } from "@upstash/rag-chat";
import { redis } from "./redis";

function getMaxTokens(query: string): number {
  // Simple heuristic: longer queries get more tokens
  if (query.length > 100) {
    return 500; // More complex query
  }
  return 300; // Simpler query
}

export const ragConfig = (query: string) => ({
  model: openai("gpt-4-turbo"),
  redis: redis,
  retrievalOptions: {
    topK: 3, // Reduce from 5 to 3 to limit context size
    minScore: 0.7,
  },
  modelOptions: {
    max_tokens: getMaxTokens(query), // Dynamic token allocation
    temperature: 0.7,
  },
});