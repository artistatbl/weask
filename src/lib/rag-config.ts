import { upstash, openai } from "@upstash/rag-chat";
import { redis } from "./redis";

export const ragConfig = {
  model: openai("gpt-4-turbo"),
  redis: redis,
  retrievalOptions: {
    topK: 3, // Reduce from 5 to 3 to limit context size
    minScore: 0.7,
  },
  modelOptions: {
    max_tokens: 300, // Limit the response length
    temperature: 0.7,
  },
};