// src/lib/chatStreamLogic.ts

import { ragChat } from "@/lib/rag-chat";
import { prisma } from "@/lib/db";
import { ratelimitConfig } from "@/lib/rateLimiter";
import * as server from "@clerk/nextjs/server";
import { redis } from "@/lib/redis";
import { retryWithBackoff } from "@/lib/retry-backoff";
import { estimateTokens } from "@/lib/utils";
import { RagChatResponse } from "@/types/ragChat";

export async function processChatStream(user: server.User, messages: { content: string }[], sessionId: string, userPlan: string, indexedUrl: string) {
  console.log("Received indexedUrl in processChatStream:", indexedUrl);

  if (!indexedUrl) {
    console.warn("indexedUrl is not provided, using a default value");
    indexedUrl = "https://en.wikipedia.org/wiki/Main_Page"; // Or any other default URL
  }

  if (ratelimitConfig.enabled && ratelimitConfig.ratelimit) {
    const { success, reset, remaining } = await ratelimitConfig.ratelimit.limit(user.id);
    const resetInMinutes = Math.ceil((reset - Date.now()) / 60000);
    console.log(`Rate limit check for user ${user.id}: success=${success}, remaining=${remaining}, reset in ${resetInMinutes} minutes`);
    if (!success) {
      throw { 
        status: 429, 
        message: `Rate limit exceeded. Please try again in ${resetInMinutes} minutes.`, 
        reset: resetInMinutes 
      };
    }
  }

  const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } });
  if (!dbUser) {
    throw { status: 404, message: "User not found in database" };
  }

  // Updated context about the indexed URL
  const urlContext = `This conversation is about the content from the URL: ${indexedUrl}. Please provide responses based on the information indexed from this URL. If the user's question is unrelated, politely redirect them to the topic of the indexed URL.`;
  await ragChat.context.add(urlContext);
  console.log("URL Context:", urlContext);

  const lastMessage = messages[messages.length - 1].content;

  await prisma.chatMessage.create({
    data: {
      sessionId,
      role: "user",
      content: lastMessage,
      userId: dbUser.id,
    },
  });

  const aiOptions = userPlan === 'premium' ? { advanced: true } : { basic: true };
  
  const cacheKey = `response:${sessionId}:${lastMessage}`;
  const cachedResponse = await redis.get(cacheKey);
  if (cachedResponse && typeof cachedResponse === 'string') {
    return JSON.parse(cachedResponse);
  }

  const result = await retryWithBackoff(async () => {
    const response: RagChatResponse = await ragChat.chat(lastMessage, { 
      streaming: true, 
      sessionId, 
      ...aiOptions,
      context: urlContext
    });
    if ((response as any).usage && typeof (response as any).usage.total_tokens === 'number') {
      // await tokenTracker.recordUsage((response as any).usage.total_tokens, estimatedTokens);
    }
    return response;
  });

  await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
  return result;
}
