import { upstash, openai } from "@upstash/rag-chat";
import { redis } from "./redis";

function getMaxTokens(query: string): number {
  // Adjust token allocation based on query length and complexity
  if (query.length > 150) {
    return 400;
  } else if (query.length > 100) {
    return 300;
  }
  return 200;
}

function getTemperature(query: string): number {
  // Adjust temperature based on query characteristics
  if (query.toLowerCase().includes("explain") || query.toLowerCase().includes("how")) {
    return 0.7; // Higher temperature for explanations
  }
  return 0.5; // Lower temperature for factual responses
}

export const ragConfig = (query: string, indexedUrl: string) => ({
  model: upstash("mistralai/Mistral-7B-Instruct-v0.2"),

  redis: redis,
  retrievalOptions: {
    topK: 3, // Retrieve top 3 most relevant chunks
    minScore: 0.7, // Increased from 0.75 to allow slightly less relevant but potentially useful information
  },
  modelOptions: {
    max_tokens: getMaxTokens(query),
    temperature: getTemperature(query),
  },
  systemPrompt: `You are an AI assistant focused on providing information about the content from ${indexedUrl}. 
    Your primary goal is to answer questions based on this content. If a question is unrelated, 
    politely redirect the user to the topic of the indexed URL. Always strive to be helpful and informative.`,
});