// src/app/api/chat-stream/route.ts

import { NextRequest, NextResponse } from "next/server";
import { aiUseChatAdapter } from "@upstash/rag-chat/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { processChatStream } from "@/lib/chatStreamLogic";
import { ratelimitConfig } from "@/lib/rateLimiter";

const MAX_RETRIES = 3;

async function checkRateLimit(userId: string, retries = 0): Promise<{ success: boolean, limit?: number, reset?: number, remaining?: number }> {
  if (!ratelimitConfig.enabled || !ratelimitConfig.ratelimit) {
    return { success: true };
  }
  try {
    const result = await ratelimitConfig.ratelimit.limit(userId);
    return result;
  } catch (error) {
    console.error("Rate limit error:", error);
    if (retries < MAX_RETRIES) {
      console.log(`Retrying rate limit check (${retries + 1}/${MAX_RETRIES})`);
      return checkRateLimit(userId, retries + 1);
    }
    throw error;
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Apply rate limiting with retry
    const { success, limit, reset, remaining } = await checkRateLimit(user.id);
    if (!success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "You've reached the maximum number of requests. Please try again later.",
          limit,
          reset,
        },
        {
          status: 429,
          headers: reset ? { 'Retry-After': reset.toString() } : undefined
        }
      );
    }

    const body = await req.json();
    const { messages, sessionId, userPlan, indexedUrl } = body;
    
    console.log("Received request body:", body);
    console.log("Received sessionId:", sessionId);
    console.log("Received indexedUrl:", indexedUrl);
    

    let extractedUrl = indexedUrl;
    if (!extractedUrl && sessionId) {
      const urlPart = sessionId.split('--')[0];
      extractedUrl = urlPart.startsWith('http') ? urlPart : `https://${urlPart}`;
      extractedUrl = extractedUrl.replace(/^https:\/\/https:\/\//, 'https://');
      extractedUrl = extractedUrl.replace(/org$/, 'org/');
      extractedUrl = extractedUrl.replace(/^https:\/\/httpsen\./, 'https://en.');
    }

    if (!extractedUrl) {
      console.error("Failed to extract a valid URL");
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
      // console.log(indexedUrl)
    }

    console.log("Using indexedUrl:", extractedUrl);

    const response = await processChatStream(user, messages, sessionId, userPlan, extractedUrl);
    console.log("Process chat stream response:", response);
    return aiUseChatAdapter(response);
  } catch (error: any) {
    console.error("Chat stream error:", error);
    if (error.status === 404) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("Detailed error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: error.message },
      { status: 500 }
    );
  }
};